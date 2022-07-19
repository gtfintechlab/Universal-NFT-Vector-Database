import pinecone
from towhee import pipeline

def convert_to_vector(image_path):
    try:
        embedding_pipeline = pipeline('image-embedding')
        vector = embedding_pipeline(image_path)

        return {"success": True, "vector": vector}
    except Exception as e:
        print(e)
        return {"success": False, "vector": None}

def insert_pinecone(index, input_vector, vector_id, vector_metadata):
    index = pinecone.Index("pinecone-index")
    index.upsert(vector_id, input_vector, vector_metadata)
    return True

if __name__ == '__main__':
    embedding_pipeline = pipeline('image-embedding')
    embedding = embedding_pipeline("https://ipfs.io/ipfs/QmdVvsjMPPNtQtoqp9xRyX9VowDWEndNEAdqas62KQGrQ4")
    print(embedding)
    