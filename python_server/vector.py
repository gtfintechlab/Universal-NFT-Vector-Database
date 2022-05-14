import numpy as np
import pdqhash

def convert_to_vector(pillowImage):
    try:
        pillowImage = np.array(pillowImage)
        rawVector, quality = pdqhash.compute(pillowImage)
        binaryVector = bytes(np.packbits(rawVector, axis=-1).tolist())

        return {"success": True, "rawVector": rawVector, "vector": binaryVector}
    except:
        return {"success": False, "rawVector": None, "vector": None}
