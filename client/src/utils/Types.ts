

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
    tokenURI: string,
}

interface TaskQueueItem{
    id: string,
    type: string,
    import: Date,
    data: Object
}

export type {Contract, NFT};