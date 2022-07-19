import requests
import json
import base64

with open("gt-original.png", "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read()).decode("utf-8") 

data = {
    'image': encoded_string,
    'amount': 100
}

url = 'http://127.0.0.1:5000/api/search'
x = requests.post(url, json=data, headers={'Content-Type': 'application/json'})
print(json.dumps(x.json(), indent=4, sort_keys=True))
# print(x.json())