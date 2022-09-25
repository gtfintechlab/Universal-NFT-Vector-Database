import base64
import io
import os
from PIL import Image
from img2vec_pytorch import Img2Vec
from utils.get_secrets import get_all_secrets
import requests
from towhee import pipeline
from uuid import uuid4

secrets_dict = get_all_secrets()

def convert_to_vector(base64String):
    try:
        file_content = base64.b64decode(base64String)
        image = Image.open(io.BytesIO(file_content))
        path = 'tmp/' + str(uuid4()) + '.png'
        image.save(path, "PNG")
        embedding_pipeline = pipeline('towhee/image-embedding-regnety-080')
        vector = embedding_pipeline(path)
        os.remove(path)
        return {"success": True, "vector": vector}
    except Exception as e:
        print(e)
        return {"success": False, "vector": None}

def search_pinecone(index, input_vector, amount=3, withVector=False, withMetadata=True):
    headers = {
        'Api-Key': secrets_dict['PINECONE_API_KEY'],
    }
    input_vector = list(input_vector)
    input_vector = [float(num) for num in input_vector]
    json_data = {
        'topK': amount,
        'includeValues': withVector,
        'includeMetadata': withMetadata,
        'vector': input_vector
    }
    response = requests.post(secrets_dict['ALL_NFTS_PINECONE_ENDPOINT'] +'/query', 
                            headers=headers, json=json_data)    
    return response

if __name__ == '__main__':
    with open("gt-original.png", "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    
    vector = convert_to_vector(encoded_string)
    print(vector)
