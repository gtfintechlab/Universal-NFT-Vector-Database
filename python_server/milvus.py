from pymilvus import (
    connections,
    utility,
    FieldSchema, CollectionSchema, DataType,
    Collection,
)

def initialize_milvus(collection_name="ethereum_erc721"):
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

def search_data_milvus(inputVector, collection_name="ethereum_erc721", field_name="nft", amount=3):
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
