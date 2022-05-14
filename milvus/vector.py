import numpy as np
import pdqhash
from PIL import Image
import requests

def convertToVector(pillowImage):
    try:
        pillowImage = np.array(pillowImage)
        rawVector, quality = pdqhash.compute(pillowImage)
        binaryVector = bytes(np.packbits(rawVector, axis=-1).tolist())

        return {"success": True, "rawVector": rawVector, "vector": binaryVector}
    except:
        return {"success": False, "rawVector": None, "vector": None}

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
    # image = getImageFromURL("https://ipfs.io/ipfs/QmVdxTPraJKZskdfFk1kwCWXo6JUwhLRY95M7b1ZUDWxB6")
    # vector = convertToVector(image['image'])
    image_og = Image.open("images/gt-original.png")
    image_altered = Image.open("images/gt-altered.png")
    vectorOne = convertToVector(image_og['image'])
    vectorTwo = convertToVector(image_altered['image'])
    