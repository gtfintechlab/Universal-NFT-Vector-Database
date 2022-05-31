import axios from "axios";
import { AnalyticsProps, Contract, NFT, TaskQueueItem } from "../utils/Types";

const host = "https://us-central1-universal-nft-vector-database.cloudfunctions.net/api";

async function getTaskQueueItems(){
    const response = await axios.get(host + "/api/taskQueue/get");
    if (response.status === 200){
        return response.data.items;
    }
    return [];

}

async function getAnalytics(){
    try {
        const response = await axios.get(host + "/api/analytics/get");
        if (response.status === 200) {
            return {
                totalContracts: response.data.totalContracts,
                totalERC1155: response.data.totalERC1155,
                totalERC721: response.data.totalERC721,
                totalEthereumNFTs: response.data.totalEthereumNFTs,
                totalNFTs: response.data.totalNFTs
            };
        }
    } catch (error) {
        return {
            totalContracts: 0,
            totalERC1155: 0,
            totalERC721: 0,
            totalEthereumNFTs: 0,
            totalNFTs: 0
        } as AnalyticsProps;
    }
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