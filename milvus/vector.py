import io
import requests
from towhee import pipeline
from PIL import Image

def convert_to_vector(image_path):
    try:
        embedding_pipeline = pipeline('image-embedding')
        vector = embedding_pipeline(image_path)

        return {"success": True, "vector": vector}
    except Exception as e:
        print(e)
        return {"success": False, "vector": None}

if __name__ == '__main__':
    embedding_pipeline = pipeline('image-embedding')
    embedding = embedding_pipeline("https://ipfs.io/ipfs/QmdVvsjMPPNtQtoqp9xRyX9VowDWEndNEAdqas62KQGrQ4")
    print(embedding)
    