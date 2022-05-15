from flask import Flask, request
from PIL import Image
from io import BytesIO
import base64
from milvus import search_data_milvus, initialize_milvus
from vector import convert_to_vector
from pymilvus import connections

app = Flask(__name__)

@app.route("/api/milvus/search", methods=['POST'])
def search():
    base_64_image = request.json['image']
    amount = request.json['amount']
    
    pillow_image = Image.open(BytesIO(base64.b64decode(base_64_image)))
    input_vector = convert_to_vector(pillow_image)
    
    initialize_milvus()
    results = search_data_milvus([input_vector['rawVector']], amount=amount)
    ids = list(results[0].ids)
    distances = list(results[0].distances)
    result_json = {

    }

    for index, milvus_id in enumerate(ids):
        result_json[index] = {}
        result_json[index]['milvusId'] = milvus_id
        result_json[index]['distance'] = distances[index]
    
    connections.disconnect("default")

    return { "results": result_json}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
