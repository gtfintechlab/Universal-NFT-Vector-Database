

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
    queueImport: Date               //  time at which nft was added into queue
}

export type {Contract, NFT};