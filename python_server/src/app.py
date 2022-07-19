from flask import Flask, request
from utils.vector import convert_to_vector, search_pinecone
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__)

@app.route('/')
def home():
    return {"Hello": "World"}

@app.route("/api/search", methods=['POST'])
def search():
    base_64_image = request.json['image']
    amount = request.json['amount']
    input_vector = convert_to_vector(base_64_image)
    
    results = search_pinecone(
                            index="all-nfts", 
                            input_vector=input_vector['vector'], 
                            amount=amount
                            )

    return results.json()

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
