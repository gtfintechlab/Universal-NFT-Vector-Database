import express from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import {initializeApp, cert} from 'firebase-admin/app';
import { cwd } from 'process';
import { TaskQueueItem, TaskQueueType } from './Types';

const api = express();

const serviceAccount = require(cwd() + '/firebase_credentials.json');
initializeApp({
  credential: cert(serviceAccount),
});
const database = getFirestore();


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