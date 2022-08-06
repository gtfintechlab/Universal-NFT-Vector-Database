from utils.get_secrets import get_all_secrets
from pymongo import MongoClient

secrets_dict = get_all_secrets()


def update_analytics(searchApiFailure=False, searchApiSuccess=False):
    client = MongoClient(secrets_dict["MONGO_DB_URL"])
    database = client['universal-nft-vector-database']

    # Get Analytics Collection
    initialStats = database['analytics'].find_one()

    analytics = database['analytics'].update_one({}, {
        "$set": { "searchApiFailure": initialStats["searchApiFailure"] + int(searchApiFailure),
                "searchApiSuccess": initialStats["searchApiSuccess"] + int(searchApiSuccess),
                }
        })
