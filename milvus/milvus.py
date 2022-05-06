# https://github.com/zamanmub/bootcamp/blob/fb82b992c76031a7c1019653f1e4ff9232243334/solutions/reverse_image_search/image_hash/image_hash_search.ipynb
# https://github.com/milvus-io/bootcamp/blob/master/solutions/reverse_image_search/reverse_image_search.ipynb

import numpy as np
from pymilvus import (
    connections,
    utility,
    FieldSchema, CollectionSchema, DataType,
    Collection,
)
from vector import *

def initializeMilvus(collection_name="ethereum_erc721"):
    connections.connect("default", host="localhost", port="19530")
    if not utility.has_collection(collection_name):
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="nft", dtype=DataType.FLOAT_VECTOR, dim=256),
        ]

        schema = CollectionSchema(fields)
        milvus_nft = Collection(collection_name, schema, consistency_level="Strong")
        return milvus_nft

    return Collection(collection_name)      

def insertDataMilvus(nftVector, nftId, collection_name="ethereum_erc721", vectorId=0):
    decimalId = int(nftId, 16)
    print(nftVector)
    inputVector = [
        [nftVector],
    ]
    collection = Collection(collection_name)
    collection.load()
    collection.insert(inputVector)
    collection.release()

def searchDataMilvus(inputVector, collection_name="ethereum_erc721", field_name="nft", amount=3):
    index = {"index_type": "BIN_FLAT", "params": {}, "metric_type": "HAMMING"}

    collection = Collection(collection_name)
    collection.create_index(field_name, index)
    collection.load()

    search_params = {
        "metric_type": "l2",
        "params": {"nprobe": 10},
    }

    result = collection.search(inputVector, field_name, search_params, limit=amount)

    collection.release()

    return result

if __name__ == '__main__':
    initializeMilvus()
    image = getImageFromURL("https://ipfs.io/ipfs/QmVdxTPraJKZskdfFk1kwCWXo6JUwhLRY95M7b1ZUDWxB6")
    imgVector = convertToVector(image['image'])
    # insertDataMilvus(nftVector=imgVector['rawVector'], nftId="0x0080313cfc8a816348092290f2ce8d348c265d5a9dd9878ee019232245422fc9")
    vec = [imgVector['rawVector']]
    result = searchDataMilvus(inputVector=vec)
    print(result)