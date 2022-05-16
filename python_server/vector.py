import base64
import io
from PIL import Image
from uuid import uuid4
import numpy as np
from towhee import pipeline
import os

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
