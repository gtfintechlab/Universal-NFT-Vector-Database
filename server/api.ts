import express from 'express';
import bodyParser from 'body-parser';
import { getFirestore } from 'firebase-admin/firestore';
import {initializeApp, cert} from 'firebase-admin/app';
import { cwd } from 'process';
import { TaskQueueItem, TaskQueueType, NFT, Contract, BlockchainType, NFTType, TaskQueueStatus} from './Types';

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

function isValidNFT(nft: NFT): boolean {
    try {
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
    } catch {
        return false
    }
}

function isValidContract(contract: Contract): boolean {
    try {
        if(
            checkField(contract.id) &&
            checkField(contract.address) &&
            checkField(contract.name) &&
            (Object.values(NFTType).includes(contract.type)) &&
            (Object.values(BlockchainType).includes(contract.chain))
        ) {
            return true
        }
        return false
    } catch {
        return false
    }
}

function isValidTaskQueueItem(taskQueueItem: TaskQueueItem): boolean {
    if(
        checkField(taskQueueItem.id) &&
        (Object.values(TaskQueueType).includes(taskQueueItem.type)) &&
        (Object.values(TaskQueueStatus).includes(taskQueueItem.status)) &&
        (isValidNFT(taskQueueItem.data as NFT) || isValidContract(taskQueueItem.data as Contract))
    ) {
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
        const taskQueueItems = await database.collection("task_queue").where("status", "==", TaskQueueStatus.IN_PROGRESS).get();
        
        const finalItems: TaskQueueItem[] = [];
        
        taskQueueItems.forEach((item) => {
            finalItems.push(item.data() as TaskQueueItem);
        })

        res.status(200).json({
            success: true,
            items: finalItems,
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
        const valid = isValidNFT(nft);

        if (!valid) {
            throw new Error("Invalid NFT Data")
        }

        await database.collection("all_nfts").doc(nft.id).set(nft);

        res.status(200).json({
            "success": true,
            "data": nft
        })
    } catch (error) {
        let message;

        if (error instanceof Error){ 
            message = error.message;
        } else{
            message = String(error);
        }

        res.status(400).json({
            "success": false,
            "error": message
        })
    }

});

api.post("/api/contracts/addAll", async (req, res) => {
    try {
        const contract: Contract = req.body;
        const valid = isValidContract(contract);

        if (!valid) {
            throw new Error("Invalid Contract Data")
        }

        await database.collection("all_contracts").doc(contract.id).set(contract);

        res.status(200).json({
            "success": true,
            "data": contract
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

api.post("/api/taskQueue/add", async (req, res) => {
    try {
        const tQItem: TaskQueueItem = req.body;
        const valid = isValidTaskQueueItem(tQItem);

        if (!valid) {
            throw new Error("Invalid TaskQueueItem Data")
        }

        await database.collection("task_queue").doc(tQItem.id).set(tQItem);

        res.status(200).json({
            "success": true,
            "data": tQItem
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

