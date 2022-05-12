import os
import time
from google.cloud import firestore
import boto3
from dotenv import load_dotenv
load_dotenv()  

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getcwd() + os.sep + "firebase_credentials.json"
database = firestore.Client()
sqs = boto3.client('sqs', region_name='us-east-1', aws_access_key_id=os.getenv("CLIENT_KEY"),
                   aws_secret_access_key=os.getenv("CLIENT_SECRET"))
queue_url = os.getenv("AWS_SQS_URL")

def main():
    # While True for Task Queue Script
    while True:
        # Get Item id from Top of Queue
        item_id = peek_queue()
        # If Queue is empty, take a 60 second break
        if not item_id:
            time.sleep(60)
            continue
        
        # Get item assoicated with item id
        item = get_item_from_task_queue(item_id)

        # If there is not an item, add the item id to the failed
        if not item:
            add_processed(item_id, "failure")
            continue
        
        # If the item type is a contract, process as per contract guidlines
        if item.type == "contract":
            # Process the contract as necessary
            process_contract(item)
            # Add contract to the appropriate contracts collection
            add_contract_to_database(item)
            # Move the id from the queue to the success
            update_processed(item_id, "success")
        
        # If the item is an NFT, process as per NFT guidelines
        elif item.type == "nft":
            # Process the NFT as necessary
            process_nft(item)
            # Add NFT to the appropriate NFT collections
            add_nft_to_database(item)
            # Move the id from the queue to the success
            update_processed(item_id, "success")

def peek_queue():
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

def get_item_from_task_queue(item_id):
    # Get the item based on item id
    task_queue_item = database.collection("task_queue").document(item_id).get()
    # Return the item
    if task_queue_item:
        return task_queue_item.to_dict()
    else:
        return None

def update_processed(item, status="success"):
    # Update the status of the item
    item['status'] = status
    # Update the database with new status
    database.collection('task_queue').document(item.id).update(item)
    return True


def process_contract(item):
    pass

def process_nft(item):
    pass

def add_nft_to_database(item):
    try:
        # Get NFT Collection
        nft_collection = database.collection("all_nfts")
        # Get the nft itself that we will add
        nft_to_add = item.data
        # Create a new document in the NFT database to add this
        nft_collection.document(nft_to_add.id).create(nft_to_add)
        return True
    except:
        return False

def add_contract_to_database(item):
    try:
        # Get the Contract Collection
        contract_collection = database.collection("all_contracts")
        # Get the contract itself that we will add
        contract_to_add = item.data
        # Create a new document in the contract's collection to add this
        contract_collection.document(contract_to_add.id).create(contract_to_add)
        return True
    except:
        return False

def updateAnalytics():
    pass


if __name__ == '__main__':
    print(peek_queue())