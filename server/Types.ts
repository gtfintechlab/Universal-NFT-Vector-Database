interface Contract{
    id: string,                     // firebase id
    address: string,                // address of contract
    name: string,                   // name of contract
    type: NFTType,                  // ERC721 vs ERC 1155 Contract
    chain: BlockchainType           // Chain this contract is on
}

interface NFT{
    id: string,                     // firebase id
    contractAddress: string,        // contract of token
    tokenId: string,                // id of token on the blockchain
    media: string,                  // file link to token
    tokenURI: string,               // metadata of token
    type: NFTType,                  // erc-721 vs erc-1155
    chain: BlockchainType,          // ethereum / polygon / another chain
    milvusId: number                // id of image in milvus
}

interface TaskQueueItem{
    id: string,                     // firebase id
    type: TaskQueueType,            // type of task in task queue
    status: TaskQueueStatus,        // status of item in task queue
    data: NFT | Contract            // data of task queue job
}

export enum BlockchainType{
    ETHEREUM = "ethereum",
    POLYGON = "polygon"
}

export enum NFTType{
    ERC_721 = "ERC721",
    ERC_1155 = "ERC1155"
}

export enum TaskQueueType{
    ITEM_CONTRACT = "contract",
    ITEM_NFT = "nft"
}

export enum TaskQueueStatus{
    IN_PROGRESS = "in progress",
    SUCCESS = "success",
    FAILURE = "failure"
};

export type {Contract, NFT,TaskQueueItem};