import { AnalyticsProps, Contract, NFT, TaskQueueItem } from "../utils/Types";

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

async function addToTaskQueue(item: TaskQueueItem){

}

async function getLastContract(){
    return "";
}

async function updateLastContract(newAddress: string){

}

export {getTaskQueueItems, getAnalytics, addToTaskQueue, getLastContract, updateLastContract};