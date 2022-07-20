import base64
import io
from PIL import Image
from img2vec_pytorch import Img2Vec
from get_secrets import get_all_secrets
import requests

secrets_dict = get_all_secrets()

def convert_to_vector(base64String):
    try:
        img2vec = Img2Vec(cuda=False, model='efficientnet_b5')
        file_content = base64.b64decode(base64String)
        image = Image.open(io.BytesIO(file_content)).convert('RGB')
        vector = img2vec.get_vec(image, tensor=False)
        return {"success": True, "vector": vector}
    except Exception as e:
        print(e)
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

if __name__ == '__main__':
    with open("gt-original.png", "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    
    vector = convert_to_vector(encoded_string)
    print(vector)
