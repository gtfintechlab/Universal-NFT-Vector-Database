# https://github.com/zamanmub/bootcamp/blob/fb82b992c76031a7c1019653f1e4ff9232243334/solutions/reverse_image_search/image_hash/image_hash_search.ipynb
# https://github.com/milvus-io/bootcamp/blob/master/solutions/reverse_image_search/reverse_image_search.ipynb

import numpy as np
from pymilvus import (
    connections,
    utility,
    FieldSchema, CollectionSchema, DataType,
    Collection,
)
from vector import convert_to_vector

def initialize_milvus(collection_name="ethereum_erc721"):
    connections.connect("default", host="localhost", port="19530")
    if not utility.has_collection(collection_name):
        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="nft", dtype=DataType.FLOAT_VECTOR, dim=2048),
        ]

        schema = CollectionSchema(fields)
        milvus_nft = Collection(collection_name, schema, consistency_level="Strong")
        return milvus_nft

    return Collection(collection_name)      

def insert_data_milvus(nftVector, nftId="", collection_name="ethereum_erc721", vectorId=0):
    # decimalId = int(nftId, 16)
    inputVector = [
        [nftVector],
    ]
    collection = Collection(collection_name)
    collection.load()
    result = collection.insert(inputVector)
    collection.release()
    return result

def search_data_milvus(inputVector, collection_name="ethereum_erc721", field_name="nft", amount=3):
    index = {
        "metric_type":"L2",
        "index_type":"IVF_FLAT",
        "params":{"nlist":1024}
    }

    collection = Collection(collection_name)
    collection.create_index(field_name, index)
    collection.load()

    search_params = {
        "metric_type": "L2",
        "params": {"nprobe": 10},
    }

    result = collection.search(inputVector, field_name, search_params, limit=amount)

    collection.release()

    return result

if __name__ == '__main__':
    initialize_milvus()
    vectorOne = convert_to_vector("./images/gt-original.png")
    vectorTwo = convert_to_vector("./images/gt-altered.png")
    vectorThree = convert_to_vector("./images/gt-3.png")

    vec = vectorOne['vector']
    vec2 = vectorTwo['vector']
    vec3 = vectorThree['vector']

    print(vec)
    print(vec2)
    print(vec3)

    res = insert_data_milvus(nftVector=vec)
    res = insert_data_milvus(nftVector=vec2)
    res = insert_data_milvus(nftVector=vec3)

    result = search_data_milvus(inputVector=[vec],amount=100)
    print("\n",result[0].distances)