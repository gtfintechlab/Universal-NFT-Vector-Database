import time

import numpy as np
from pymilvus import (
    connections,
    utility,
    FieldSchema, CollectionSchema, DataType,
    Collection,
)

def initializeMilvus(collection_name="ethereum-erc721"):
    connections.connect("default", host="localhost", port="19530")
    if not utility.has_collection(collection_name):
        fields = [
            FieldSchema(name="nft", dtype=DataType.INT64),
            FieldSchema(name="nftId", dtype=DataType.STRING),
        ]

        schema = CollectionSchema(fields)
        milvus_nft = Collection(collection_name, schema, consistency_level="Strong")
        return milvus_nft

    return Collection(collection_name)      

def insertDataMilvus(nftVector, nftId, collection_name):
    inputVector = [
        nftVector,
        [nftId]
    ]
    collection = Collection(collection_name)
    collection.load()
    collection.insert(inputVector)
    collection.release()

def searchDataMilvus(inputVector, collection_name="ethereum-erc721", field_name="nft", amount=3):
    index = {
        "index_type": "IVF_FLAT",
        "metric_type": "L2",
        "params": {"nlist": 128},
    }

    collection = Collection(collection_name)
    collection.create_index(field_name, index)
    collection.load()

    search_params = {
        "metric_type": "l2",
        "params": {"nprobe": 10},
    }

    result = collection.search(inputVector, field_name, search_params, limit=amount, output_fields=["nftId"])

    collection.release()

    return result