import requests
from requests.auth import HTTPBasicAuth
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

def get_all_secrets():
    result = requests.get("https://api.doppler.com/v3/configs/config/secrets/download?format=json",
                            verify=True,
                            auth=HTTPBasicAuth(os.environ['DOPPLER_SERVICE_TOKEN'], '')
                         )
    return result.json()

secret_vars = get_all_secrets()

if __name__ == '__main__':
    print(get_all_secrets())