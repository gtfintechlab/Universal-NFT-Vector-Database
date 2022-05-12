interface Contract{
    id: string,                     // id and address are the same
    address: string,
    name: string,
}

interface NFT{
    id: string,                     // id and transactionId are the same
    transactionId: string,
    contractAddress: string,
    mintTime: Date,
    tokenId: number,
    owner: string,
    media: string, 
    tokenURI: string,
}

interface TaskQueueItem{
    id: string,
    type: TaskQueueType,
    import: Date,
    status: TaskQueueStatus,
    data: NFT | Contract
}

interface AnalyticsProps{
    totalContracts: number,
    totalERC1155: number,
    totalERC721: number,
    totalEthereumNFTs: number,
    totalNFTs: number
}

interface TaskQueueProps{
    tableName: string,
    data: TaskQueueItem[]
}

export enum TaskQueueType{
    ITEM_CONTRACT = "contract",
    ITEM_NFT = "NFT"
}

export enum TaskQueueStatus{
    IN_PROGRESS = "in progress",
    SUCCESS = "success",
    FAILURE = "failure"
};

export type {Contract, NFT, AnalyticsProps,TaskQueueItem, TaskQueueProps};