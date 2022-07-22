import requests
import json
import base64

with open("gt-original.png", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode("utf-8") 

data = {
    'image': encoded_string,
    'amount': 1,
    'withVector': False,
    'withMetadata': False
}

url = 'https://universal-nft-vector-database.web.app/api/search'
x = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
print(json.dumps(x.json(), indent=4, sort_keys=True))