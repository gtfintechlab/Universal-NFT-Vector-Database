import express from 'express';
import bodyParser from 'body-parser';
import { getFirestore } from 'firebase-admin/firestore';
import {initializeApp, cert} from 'firebase-admin/app';
import { cwd } from 'process';
import { TaskQueueItem, TaskQueueType, NFT, BlockchainType, NFTType} from './Types';

const api = express();

// Middleware for Express 
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

const serviceAccount = require(cwd() + '/firebase_credentials.json');
initializeApp({
  credential: cert(serviceAccount),
});
const database = getFirestore();

function checkField(str: string): boolean {
    if (str == null || str.length == 0){
        return false
    }
    return true
}

function isValid(nft: NFT): boolean{
    if (
        checkField(nft.id) &&
        checkField(nft.contractAddress) &&
        !isNaN(nft.tokenId) &&
        checkField(nft.media) &&
        checkField(nft.tokenURI) &&
        (Object.values(NFTType).includes(nft.type)) &&
        (Object.values(BlockchainType).includes(nft.chain))
    ){
        return true
    }
    return false
}


const APP_PORT = 3000;

api.get("/api/analytics/get" , async (req, res) => {
    try{
        const analyticsDocument = await database.collection("analytics").doc("analytics").get();
        if (analyticsDocument.exists){
            const analytics = analyticsDocument.data();
            res.status(200).json({
                success: true,
                ...analytics
            });
        } else {
            res.status(400).json({
                success: false,
                error: "Failed to retrieve Analytics"
            });
        }
    } catch{
        res.status(400).json({
            success: false,
            error: "Something went wrong -- please try again!"
        });
    }

});

api.get("/api/taskQueue/get", async (req, res) => {
    try{
        const taskQueueNfts = await database.collection("task_queue").where("type", "==", TaskQueueType.ITEM_NFT).get();
        const taskQueueContracts = await database.collection("task_queue").where("type", "==", TaskQueueType.ITEM_CONTRACT).get();
        
        const nfts: TaskQueueItem[] = [];
        const contracts: TaskQueueItem[] = [];
        
        taskQueueContracts.forEach((contract) => {
            contracts.push(contract.data() as TaskQueueItem);
        })

        taskQueueNfts.forEach((nft) => {
            nfts.push(nft.data() as TaskQueueItem);
        })

        res.status(200).json({
            success: true,
            contracts: contracts,
            nfts: nfts
        });
    } catch {
        res.status(400).json({
            success: false,
            error: "Something went wrong -- please try again!"
        });
    }
})

api.get("/", (req, res) => {
    res.status(200).json({
        "Hello": "World"
    });
});

api.listen(APP_PORT, () => {
    console.log(`api listening at http://localhost:${APP_PORT}`);
});



api.post("/api/nfts/addAll", async (req, res) => {
    try {
        const nft: NFT = req.body;
        const valid = isValid(nft);

        if (!valid) {
            throw new Error("Invalid NFT Data")
        }

        await database.collection("all_nfts").doc(nft.id).set(nft);

        res.status(200).json({
            "success": true,
            "data": nft
        })
    } catch (error) {
        let message

        if (error instanceof Error) message = error.message
        else message = String(error)

        res.status(400).json({
            "success": false,
            "error": message
        })
    }

});

api.post("/api/contracts/addAll", (req, res) => {
    try {

    } catch {
        
    }
});

api.post("/api/taskQueue/add", (req, res) => {
    try {

    } catch {
        
    }
});

