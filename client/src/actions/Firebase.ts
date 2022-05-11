import { AnalyticsProps, Contract, NFT, TaskQueueItem } from "../utils/Types";

async function getContractsInQueue(){
    return [] as Contract[];
}

async function getNFTsInQueue(){
    return [] as NFT[];
}

async function getTaskQueueItems(){
    return [] as TaskQueueItem[];
}

async function getAnalytics(){
    return {
        totalContracts: 0,
        totalERC1155: 0,
        totalERC721: 0,
        totalEthereumNFTs: 0,
        totalNFTs: 0
    } as AnalyticsProps; 
}
export {getContractsInQueue, getNFTsInQueue, getTaskQueueItems, getAnalytics};