export enum NFTType{
    ERC_721 = "ERC721",
    ERC_1155 = "ERC1155"
}

export enum BlockchainType{
    ETHEREUM = "ethereum",
    POLYGON = "polygon"
}

export enum TaskQueueType{
    ITEM_CONTRACT = "contract",
    ITEM_NFT = "nft",
    ITEM_NOT_APPLICABLE = "N/A"
}

export enum TaskQueueStatus{
    IN_PROGRESS = "in progress",
    SUCCESS = "success",
    FAILURE = "failure"
};