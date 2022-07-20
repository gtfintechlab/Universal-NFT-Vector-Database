from PIL import Image
import requests
from utils.get_secrets import get_all_secrets
from img2vec_pytorch import Img2Vec

secrets_dict = get_all_secrets()

def convert_to_vector(image_path):
    try:
        img2vec = Img2Vec(cuda=False, model='efficientnet_b5')
        image = Image.open(requests.get(image_path, stream=True, timeout=5).raw).convert('RGB')
        vector = img2vec.get_vec(image, tensor=False)
        return {"success": True, "vector": vector}
    except Exception as e:
        print(e)
        return {"success": False, "vector": None}

def insert_pinecone(index, input_vector, vector_id, vector_metadata):
    input_vector = list(input_vector)
    input_vector = [float(num) for num in input_vector]
    headers = {
        'Api-Key': secrets_dict['PINECONE_API_KEY'],
        'Content-Type': 'application/json'
    }
    
    json_data = {
        'vectors': [
            {
                'id': vector_id,
                'metadata': vector_metadata,
                'values': input_vector,
            },
        ],
    }
    response = requests.post(secrets_dict['ALL_NFTS_PINECONE_ENDPOINT'] + '/vectors/upsert', headers=headers, json=json_data)
    return response

if __name__ == '__main__':
    vector = convert_to_vector('https://res.cloudinary.com/alchemyapi/image/upload/mainnet/ddd272e5032446a89f304d629877b2af.png')['vector']
    # response = insert_pinecone(index="all-nfts", input_vector=vector['vector'], vector_id="helloworld", vector_metadata={
    #     "test":"data"
    # })
    print(vector)