interface Contract{
    id: string,                     // id and address are the same
    address: string,
    name: string,
    queueImport: Date               // time at which contract was added into queue
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

interface Analytics{
    totalContracts: number,
    totalERC1155: number,
    totalERC721: number,
    totalEthereumNFTs: number,
    totalNFTs: number
}

export type {Contract, NFT, Analytics};