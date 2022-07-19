import base64
import io
from PIL import Image
from uuid import uuid4
from towhee import pipeline
import os
import pinecone
from utils.secrets import get_all_secrets

secrets = get_all_secrets()

pinecone.init(api_key=secrets['PINECONE_API_KEY'], environment="us-west1-gcp")

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
    index = pinecone.Index(index)
    result = index.query(
        vector=input_vector,
        top_k=amount,
        include_values=True,
        include_metadata=True
    )

    return result