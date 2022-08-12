from utils.get_secrets import get_all_secrets
from pymongo import MongoClient

secrets_dict = get_all_secrets()


def update_analytics(fields):
    client = MongoClient(secrets_dict["MONGO_DB_URL"])
    database = client['universal-nft-vector-database']

    for field in fields:
        database['analytics'].find_one_and_update({}, {
            '$inc': {field: 1}
        })