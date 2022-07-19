import base64
import io
from PIL import Image
from uuid import uuid4
from towhee import pipeline
import os
from utils.secrets import get_all_secrets
import requests

secrets_dict = get_all_secrets()

def convert_to_vector(base64String):
    try:
        embedding_pipeline = pipeline('image-embedding')

        file_content = base64.b64decode(base64String)
        image = Image.open(io.BytesIO(file_content))
        path = 'tmp/' + str(uuid4()) + '.png'
        image.save(path, "PNG")
        vector = embedding_pipeline(path)
        os.remove(path)
        return {"success": True, "vector": vector}
    except Exception as e:
        return {"success": False, "vector": None}

def search_pinecone(index, input_vector, amount=3):
    headers = {
        'Api-Key': secrets_dict['PINECONE_API_KEY'],
    }
    input_vector = list(input_vector)
    input_vector = [float(num) for num in input_vector]
    json_data = {
        'topK': amount,
        'includeValues': True,
        'includeMetadata': True,
        'vector': input_vector
    }
    response = requests.post(secrets_dict['ALL_NFTS_PINECONE_ENDPOINT'] +'/query', 
                            headers=headers, json=json_data)    
    return response