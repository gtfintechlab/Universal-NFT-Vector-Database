import os
from google.cloud import firestore

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getcwd() + os.sep + "firebase_credentials.json"
database = firestore.Client()

def main():
    while True:
        # Task Queue Code Here
        pass