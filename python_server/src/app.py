from flask import Flask, request
from vector import convert_to_vector, search_pinecone
from dotenv import load_dotenv, find_dotenv
from database import update_analytics
from flask_cors import CORS
from sklearn.manifold import TSNE
from sklearn.decomposition import TruncatedSVD
import numpy as np

load_dotenv(find_dotenv())

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return {"Hello": "World"}

@app.route("/api/search", methods=['POST'])
def search():
    try:
        base_64_image = request.json['image']
        amount = request.json['amount']
        withVector = request.json.get('withVector', False)
        withMetadata = request.json.get('withMetadata', True)
        input_vector = convert_to_vector(base_64_image)
        
        results = search_pinecone(
                                index="all-nfts", 
                                input_vector=input_vector['vector'], 
                                amount=amount,
                                withVector=withVector,
                                withMetadata=withMetadata
                                )
        update_analytics(['searchApiSuccess'])
        json_response = results.json()
        json_response['success'] = True
        json_response['source'] = [float(element) for element in input_vector['vector']]
        return json_response
    except Exception as e:
        update_analytics(['searchApiFailure'])
        return {"success": False, "error": e}

@app.route("/api/tsvd", methods=['POST'])
def truncated_singular_value_decomposition():
    vectors = request.json['vectors']
    individual_ids = list(vectors.keys())
    individual_vectors = [vectors[vector_id] for vector_id in individual_ids]

    tsvd = TruncatedSVD(n_components=2, n_iter=10, random_state=0)
    points = tsvd.fit_transform(np.array(individual_vectors))

    result = {}
    for index, point in enumerate(points):
        result[individual_ids[index]] = [float(pt) for pt in point]
    return result
 
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
