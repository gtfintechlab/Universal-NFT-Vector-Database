from flask import Flask, request
from vector import convert_to_vector, search_pinecone
from dotenv import load_dotenv, find_dotenv
from sklearn.manifold import MDS

load_dotenv(find_dotenv())

app = Flask(__name__)

@app.route('/')
def home():
    return {"Hello": "World"}

@app.route("/api/search", methods=['POST'])
def search():
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

    return results.json()

@app.route("/api/mds", methods=['POST'])
def multidimensional_scaling():
    vectors = request.json['vectors']
    individual_ids = list(vectors.keys())
    individual_vectors = [vectors[vector_id] for vector_id in individual_ids]
    mds = MDS()
    points = mds.fit_transform(individual_vectors)
    result = {}
    for index, point in enumerate(points):
        result[individual_ids[index]] = list(point)
    return result

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
