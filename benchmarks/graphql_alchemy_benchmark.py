from secrets_vars import secret_vars
import requests

def getNFTsAlchemy(contractAddress, chain="ethereum"):
    has_next_page = True
    start_token = ""
    token_list = []
    while has_next_page:
        helper_response = alchemyHelper(contractAddress=contractAddress, startToken=start_token, chain=chain)
        nfts = helper_response['nfts']
        if nfts and len(nfts) > 0:
            for nft in nfts:
                token_list.append(nft.get("media")[0].get("gateway"))
        
        if not helper_response.get("nextToken"):
            has_next_page = False
        
        start_token = helper_response.get("nextToken")
    
    # Return the NFT list
    return token_list


def alchemyHelper(contractAddress, startToken="", chain="ethereum"):
    try:
        if chain == "ethereum":
            base_url = secret_vars["ETHERUEM_NODE"] + "/getNFTsForCollection"
        
        with_metadata = "true";
        request_url = base_url + "/?contractAddress=" + contractAddress + "&startToken=" + startToken + "&withMetadata=" + with_metadata
        response = requests.get(request_url)
        return response.json()
    except:
        return None

def getNFTsGraphProtocol(contractAddress):
    tokens = graphProtocolHelper(1000, contractAddress, "")
    media = []
    try:
        while len(tokens) > 0:
            for index, token in enumerate(tokens):
                try:
                    tokenURI = token['tokenURI'];
                    tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
                    jsonInfo = (requests.get(tokenURI, timeout=2)).json()
                    mediaInfo = jsonInfo['image'];
                    mediaInfo = mediaInfo.replace("ipfs://", "https://ipfs.io/ipfs/");
                    
                    if mediaInfo:
                        media.append(mediaInfo);
                except:
                    continue;
            tokens = graphProtocolHelper(1000, contractAddress, tokens[len(tokens) - 1]['id'])
    except:
        return media
    return media

def graphProtocolHelper(amount, contractAddress, lastToken):
    try:
        query = """
        query{{
            tokens(first: {0} where: {{contract: "{1}", id_gt: "{2}"}}){{
                id
                tokenURI
            }}
            }}
        """.format(amount, contractAddress, lastToken)
        result = requests.post("https://api.thegraph.com/subgraphs/name/wighawag/eip721-subgraph",
                                    json={'query':query.strip() 
                            })
        return result.json()['data']['tokens']
    except:
        return []    

if __name__ == '__main__':
    import time
    totalAlchemy = 0
    totalGraph = 0
    # 176 - 0x000000000437b3cce2530936156388bff5578fc3
    # 2139 - 0x001f561c73555005a7f22e2ae9cb785cf37cc3b9
    # 14213 - 0x0000000005756b5a03e751bd0280e3a55bc05b6e
    for i in range(20):
        startAlchemy = time.time()
        alchNfts = getNFTsAlchemy("0x0000000005756b5a03e751bd0280e3a55bc05b6e")
        endAlchemy = time.time()
        print("Time For Alchemy:", endAlchemy - startAlchemy, "Seconds", i)
        print(len(alchNfts))
        totalAlchemy += (endAlchemy - startAlchemy)

        startGraph = time.time()
        graphNfts = getNFTsGraphProtocol("0x0000000005756b5a03e751bd0280e3a55bc05b6e")
        endGraph = time.time()
        print("Time for Graph Protocol:", endGraph - startGraph, "Seconds", i)
        print(len(graphNfts))
        totalGraph += (endGraph - startGraph)
    
    print("Average Alchemy:", totalAlchemy/20)
    print("Average Graph Protocol:", totalGraph/20)