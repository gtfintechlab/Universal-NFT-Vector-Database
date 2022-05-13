from email.mime import base
from flask import Flask, request
from PIL import Image
from io import BytesIO
import base64
from milvus import search_data_milvus, initialize_milvus
from vector import convert_to_vector

app = Flask(__name__)

@app.route("/api/milvus/search")
def search():
    base_64_image = request.json()['image']
    number = request.json()['number']

    pillow_image = Image.open(BytesIO(base64.b64decode(base_64_image)))
    input_vector = convert_to_vector(pillow_image)

    initialize_milvus()
    results = search_data_milvus(input_vector)
    return { "nftId": results}

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
