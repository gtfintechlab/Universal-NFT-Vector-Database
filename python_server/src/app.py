from flask import Flask, request
from vector import convert_to_vector, search_pinecone
from dotenv import load_dotenv, find_dotenv
from database import update_analytics

load_dotenv(find_dotenv())

app = Flask(__name__)

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
        update_analytics(
            searchApiSuccess=True
        )
        json_response = results.json()
        json_response['success'] = True
        return json_response
    except Exception as e:
        update_analytics(
            searchApiFailure=True
        )
        return {"success": False, "error": e}
    
if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
