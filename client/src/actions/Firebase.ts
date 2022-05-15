import axios from "axios";
import { AnalyticsProps, Contract, NFT, TaskQueueItem } from "../utils/Types";

const host = "http://localhost:4000";

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
    const response = await axios.post(host + "/api/taskQueue/add", {
        itemToAdd: item
    });
    if (response.status === 200){
        return "";
    }
    return response.data.error;
}

async function getLastContract(){
    const response = await axios.get(host + "/api/contracts/last/get");
    if (response.status === 200){
        return response.data.lastContract;
    }
    return null;

}

async function updateLastContract(newAddress: string){
    const response = await axios.post(host + "/api/contracts/last/update", {
        newContract: newAddress
    });
    if (response.status === 200){
        return "";
    }
    return response.data.error;

}

export {getTaskQueueItems, getAnalytics, addToTaskQueue, getLastContract, updateLastContract};