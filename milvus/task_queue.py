import os
import time
from google.cloud import firestore
import boto3
from dotenv import load_dotenv
from milvus import insert_data_milvus
from milvus import initialize_milvus
from vector import convertToVector, getImageFromURL
import requests

load_dotenv()  

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getcwd() + os.sep + "firebase_credentials.json"
database = firestore.Client()
sqs = boto3.client('sqs', region_name='us-east-1', aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                   aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"))
queue_url = os.getenv("JOB_SQS_URL")

def main():
    initialize_milvus()
    # While True for Task Queue Script
    while True:
        # Get Item id from Top of Queue
        item = pop_queue()
        # If Queue is empty, take a 60 second break
        if not item:
            time.sleep(60)
            continue
        
        # If the item type is a contract, process as per contract guidlines
        if item["type"] == "contract":
            # Process the contract as necessary
            result = process_contract(item)
            if not result:
                update_processed(item, "failure")
                continue
            # Add contract to the appropriate contracts collection
            add_contract_to_database(item)
            # Move the id from the queue to the success
            update_processed(item, "success")
        
        # If the item is an NFT, process as per NFT guidelines
        elif item["type"] == "nft":
            # Process the NFT as necessary
            result, milvus_id = process_nft(item)
            if not result:
                update_processed(item, "failure")
                continue
            # Add NFT to the appropriate NFT collections
            add_nft_to_database(item, milvus_id)
            # Move the id from the queue to the success
            update_processed(item, "success")

def pop_queue():
    # Get the queue from the task queue checkpoints
    response = sqs.receive_message(
                QueueUrl=queue_url,
                AttributeNames=[
                    'SentTimestamp'
                ],
                MaxNumberOfMessages=1,
                MessageAttributeNames=[
                    'All'
                ],
                VisibilityTimeout=180,
                WaitTimeSeconds=0
            )

    # If the queue is empty, return None (allows the server to take a break)
    if 'Messages' not in response:
        return None
    
    # Process the message from SQS
    message = response['Messages'][0]
    task_Id = message["MessageAttributes"].get("TaskId").get("StringValue")
    receipt_handle = message['ReceiptHandle']

    # Delete received message from queue
    sqs.delete_message(
        QueueUrl=queue_url,
        ReceiptHandle=receipt_handle
    )

    item = database.collection("task_queue").document(task_Id).get().to_dict()
    # Return the first element in the queue
    return item

def update_processed(item, status="success"):
    # Update the status of the item
    item['status'] = status
    # Update the database with new status
    database.collection('task_queue').document(item['id']).update(item)
    return True


def process_contract(item):
    token_list = get_collection_tokens(item["data"]["address"])
    for token in token_list:
        # Add token job to task queue in firebase
        temp_doc = database.collection('task_queue').document()
        task = {
            'id': temp_doc.id,
            "type": "nft",
            "status": "in progress",
            "data": token
        } 
        
        # Write to firebase
        database.collection("task_queue").document(task['id']).create(task)

        # Add ID To Task Queue
        push_to_aws_task_queue(task['id'])

    # Add contract to database
    add_contract_to_database(item)

def process_nft(item):
    try:
        # Turn image into Pillow Image
        pillow_image = getImageFromURL(item["data"]["media"])['image']
        # Get Raw Vector from Pillow Image
        vector_image = convertToVector(pillow_image)['rawVector']
        # Inser the data and get the id of the inserted image
        milvus_insert = insert_data_milvus(nftVector=vector_image)
        print(milvus_insert)
        milvus_id = milvus_insert.timestamp
        # Return the status and id
        return True, milvus_id
    except:
        return False, -1

def add_nft_to_database(item, milvus_id):
    try:
        # Get NFT Collection
        nft_collection = database.collection("all_nfts")
        # Get the nft itself that we will add
        nft_to_add = item["data"]
        # Create a new document in the NFT database to add this
        nft_to_add['milvusId'] = milvus_id
        nft_collection.document(nft_to_add['id']).create(nft_to_add)
        # update analytics
        update_analytics(totalERC1155=nft_to_add["type"] == "ERC1155", 
                            totalERC721=nft_to_add["type"] == "ERC721",
                            totalEthereumNFTs=nft_to_add["chain"] == "ethereum",
                            totalNFTs=True
                         )  
        return True
    except:
        return False

def add_contract_to_database(item):
    try:
        # Get the Contract Collection
        contract_collection = database.collection("all_contracts")
        # Get the contract itself that we will add
        contract_to_add = item["data"]
        # Create a new document in the contract's collection to add this
        contract_collection.document(contract_to_add['id']).create(contract_to_add)
        # update analytics
        update_analytics(totalContracts=True)  
        return True
    except:
        return False

def update_analytics(totalContracts=False, totalERC1155=False, totalERC721=False, totalEthereumNFTs=False, totalNFTs=False):
    # Get Analytics Collection
    analytics = database.collection("analytics").document("analytics").get().to_dict()
    # Update Analytics as per paramters
    analytics["totalContracts"] += int(totalContracts)
    analytics["totalERC1155"] += int(totalERC1155)
    analytics["totalERC721"] += int(totalERC721)
    analytics["totalEthereumNFTs"] += int(totalEthereumNFTs)
    analytics["totalNFTs"] += int(totalNFTs)
    # Update Analytics
    database.collection("analytics").document("analytics").update(analytics)

def get_collection_tokens(contractAddress, chain="ethereum"):
    # Boolean value for pagnication of Alchemy API Response
    has_next_page = True
    # Start Token for pagination
    start_token = ""
    # List to keep track of all NFTs
    token_list = []
    # While there is a next page of tokens
    while has_next_page:
        # Call the API via our helper function
        helper_response = get_collection_tokens_helper(contractAddress=contractAddress, startToken=start_token, chain=chain)
        # Get the list of NFTs
        nfts = helper_response['nfts']
        # If the NFTs exist
        if nfts and len(nfts) > 0:
            # Iterate through the NFTs
            for nft in nfts:
                # Temporary document to get a firebase id
                temp_doc = database.collection('all_nfts').document()
                # Add NFT to token list as per NFT Model specifications
                token_list.append({
                    "id": temp_doc.id,
                    "contractAddress": nft.get("contract").get("address"),
                    "tokenId": nft.get("id").get("tokenId"),
                    "media": nft.get("media")[0].get("gateway"),
                    "tokenURI": nft.get("tokenUri").get("gateway"),
                    "type": nft.get("id").get("tokenMetadata").get("tokenType"),
                    "chain": chain
                })
        
        # IF there is not a next token, stop pagination
        if not helper_response.get("nextToken"):
            has_next_page = False
        
        # Set next token
        start_token = helper_response.get("nextToken")
    
    # Return the NFT list
    return token_list

def get_collection_tokens_helper(contractAddress, startToken="", chain="ethereum"):
    try:
        # Check what chain we are on and the appropriate URL
        if chain == "ethereum":
            base_url = os.getenv("ETHERUEM_NODE") + "/getNFTsForCollection"
        
        # Get response with metadata
        with_metadata = "true";
        # Generate request URL
        request_url = base_url + "/?contractAddress=" + contractAddress + "&startToken=" + startToken + "&withMetadata=" + with_metadata
        print(request_url)
        # Get the response and return in JSON Format
        response = requests.get(request_url)
        return response.json()
    except:
        return None

def push_to_aws_task_queue(taskId):
    # Sends a message to the task queue on what task to handle next
    response = sqs.send_message(
        QueueUrl=queue_url,
        DelaySeconds=0,
        MessageAttributes={
            'TaskId': {
                'DataType': 'String',
                'StringValue': taskId
            },
        },
        MessageBody=(
            taskId
        )
    )

if __name__ == '__main__':
    item = {
        "id": "start",
        "type": "contract",
        "status": "in progress",
        "chain": "ethereum",
        "type": "ERC721",
        "data": {
            "id": "testid2",
            "address": "0x000000be320d58eabb01d14b6755b0403a93ab7d",
            "name": "TESTING CONTRACT"
        }
    }
    process_contract(item)
    main()