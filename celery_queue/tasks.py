import os
import uuid
from celery import Celery
from utils import convert_to_vector, get_collection_tokens, insert_pinecone
import config
from pymongo import MongoClient
from secrets_vars import secret_vars
from bson.objectid import ObjectId

app = Celery('tasks')
app.config_from_object(config)
client = MongoClient(secret_vars["MONGO_DB_URL"])
database_name = 'universal-nft-vector-database' if os.environ['environment'] == "production" else 'testingenv'
database = client[database_name]

@app.task
def contract(taskId):
    contract = get_item(taskId)
    processed = process_contract(contract)
    if processed:
        update_database_contract(contract, "success")
    else:
        update_database_contract(contract, "failure")
    return True

@app.task
def nft(taskId):
    nft = get_item(taskId)
    processed, vector_id = process_nft(nft)
    if processed:
        update_database_nft(nft, "success", vector_id)
    else:
        update_database_nft(nft, "failure", None)
    
    return True

def get_item(taskId):
    item = database['taskqueueitems'].find_one({
        "_id":ObjectId(taskId)
    })
    # Return the first element in the queue
    return item

def process_contract(item):
    try:
        address = item["data"]["address"]
        chain = item["data"]["chain"]
        token_list = get_collection_tokens(address, chain)
        for token in token_list:
            task = {
                "type": "nft",
                "status": "in progress",
                "data": token
            }
            database['taskqueueitems'].insert_one(task)
            nft.delay(str(task['_id']))
        return True
    except:
        return False    

def process_nft(item):
    try:
        media = item["data"]["media"]
        success, vector = convert_to_vector(media)
        if not success:
            raise Exception("Failed to Convert to Vector")

        vector_id = str(uuid.uuid4().hex)
        if os.environ["environment"] == "production":
            # Insert the data and get the id of the inserted image
            pinecone_insert = insert_pinecone(input_vector=vector,
                                            vector_id=vector_id,
                                            vector_metadata={
                                                "contract_address": item["data"]["contractAddress"],
                                                "token_id": item["data"]["tokenId"],
                                                "media": item["data"]["media"]
                                            })

        return True, vector_id
    except:
        return False, -1

def update_database_contract(contract, status):
    # Get the Task Id
    taskId = contract["_id"]
    # Update the Status on that Task Queue Item
    updated = database['taskqueueitems'].find_one_and_update(
        {"_id": taskId},
        {
            "$set": { "status": status}
        }
    )
    # If success, add to contracts list + update analytics
    if status == "success":
        database['contracts'].insert_one(
            contract["data"]
        )
        update_analytics(["totalContracts", "contractsSuccess"])
    else:
        update_analytics(["totalContracts", "contractsFailure"])
    
    return True

def update_database_nft(nft, status, vector_id):
        # Get the Task Id
    taskId = nft["_id"]
    # Update the Status on that Task Queue Item
    updated = database['taskqueueitems'].find_one_and_update(
        {"_id": taskId},
        {
            "$set": { "status": status}
        }
    )
    # If success, add to contracts list + update analytics
    analytics = ["totalNFTs"]
    if status == "success":
        # Update NFT with Vector ID
        nft["data"]['vectorId'] = vector_id
        database['nfts'].insert_one(
            nft["data"]
        )
        # Parse the Chain + NFT Standard to update Analytics
        analytics.append("nftSuccess")
        chain = nft["data"]["chain"].capitalize()
        nftStandard = nft["data"]["type"].replace('-','').upper()
        
        analytics.append(f"total{chain}NFTs")
        analytics.append(f"total{nftStandard}")
        update_analytics(analytics)
    else:
        analytics.append("nftFailure")
        update_analytics(analytics)
    
    return True


def update_analytics(fields):
    for field in fields:
        database['analytics'].find_one_and_update({}, {
            '$inc': {field: 1}
        })