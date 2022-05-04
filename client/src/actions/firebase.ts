import { Contract, NFT } from "../utils/Types";

async function getContractsInQueue(){
    return [] as Contract[];
}

async function getNFTsInQueue(){
    return [] as NFT[];
}

export {getContractsInQueue, getNFTsInQueue};