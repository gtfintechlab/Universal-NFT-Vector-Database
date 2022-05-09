

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
    data: Object
}

export enum TaskQueueType{
    ITEM_CONTRACT = "contract",
    ITEM_NFT = "NFT"
}

export type {Contract, NFT, TaskQueueItem};