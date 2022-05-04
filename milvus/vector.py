from pip import main
import numpy as np
from PIL import Image
import requests

def convertToVector(pillowImage):
    try:
        vector = np.asarray(pillowImage)
        return {"success": True, "vector": vector}
    except:
        return {"success": False, "vector": None}

def getImageFromURL(imageURL):
    try:
        image = Image.open(requests.get(imageURL, stream=True).raw)
        if image:
            return {"success": True, "image": image}
        else:
            return {"success": False, "image": None}
    except:
        return {"success": False, "image": None}

if __name__ == '__main__':
    image = getImageFromURL("https://ipfs.io/ipfs/QmVdxTPraJKZskdfFk1kwCWXo6JUwhLRY95M7b1ZUDWxB6")
    print(image)
    vector = convertToVector(image['image'])
    print(vector)