import requests
from secrets_vars import secret_vars
from PIL import Image
from img2vec_pytorch import Img2Vec
from towhee import pipeline

def get_collection_tokens(contractAddress, chain="ethereum"):
    # Boolean value for pagnication of Alchemy API Response
    has_next_page = True
    # Start Token for pagination
    start_token = ""
    # List to keep track of all NFTs
    token_list = []
    # While there is a next page of tokens
    while has_next_page:
        # Call the API via our helper function
        helper_response = get_collection_tokens_helper(contractAddress=contractAddress, startToken=start_token, chain=chain)
        # Get the list of NFTs
        nfts = helper_response['nfts']
        # If the NFTs exist
        if nfts and len(nfts) > 0:
            # Iterate through the NFTs
            for nft in nfts:
                # Add NFT to token list as per NFT Model specifications
                token_list.append({
                    "contractAddress": nft.get("contract").get("address"),
                    "tokenId": nft.get("id").get("tokenId"),
                    "media": nft.get("media")[0].get("gateway"),
                    "tokenURI": nft.get("tokenUri").get("gateway"),
                    "type": nft.get("id").get("tokenMetadata").get("tokenType"),
                    "chain": chain
                })
        
        # IF there is not a next token, stop pagination
        if not helper_response.get("nextToken"):
            has_next_page = False
        
        # Set next token
        start_token = helper_response.get("nextToken")
    
    # Return the NFT list
    return token_list

def get_collection_tokens_helper(contractAddress, startToken="", chain="ethereum"):
    try:
        # Check what chain we are on and the appropriate URL
        if chain == "ethereum":
            base_url = secret_vars["ETHERUEM_NODE"] + "/getNFTsForCollection"
        
        # Get response with metadata
        with_metadata = "true";
        # Generate request URL
        request_url = base_url + "/?contractAddress=" + contractAddress + "&startToken=" + startToken + "&withMetadata=" + with_metadata
        # Get the response and return in JSON Format
        response = requests.get(request_url)
        return response.json()
    except:
        return None

def convert_to_vector(image_path):
    try:
        embedding_pipeline = pipeline('towhee/image-embedding-regnety-080')
        vector = embedding_pipeline(image_path)
        return True, vector
    except Exception as e:
        return False, None

def insert_pinecone(input_vector, vector_id, vector_metadata):
    input_vector = list(input_vector)
    input_vector = [float(num) for num in input_vector]
    headers = {
        'Api-Key': secret_vars['PINECONE_API_KEY'],
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
    response = requests.post(secret_vars['ALL_NFTS_PINECONE_ENDPOINT'] + '/vectors/upsert', headers=headers, json=json_data)
    return response

if __name__ == '__main__':
    print(convert_to_vector('https://samratsahoo.github.io/samrat.jpg'))