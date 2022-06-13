import express from 'express';
import bodyParser from 'body-parser';
// import { getFirestore } from 'firebase-admin/firestore';
// import {initializeApp, cert} from 'firebase-admin/app';
import { cwd } from 'process';
import { TaskQueueItem, TaskQueueType, NFT, Contract, BlockchainType, NFTType, TaskQueueStatus} from './Types';
import { SQS, config } from 'aws-sdk';
import dotenv from 'dotenv'
import cors from 'cors';
import * as functions from "firebase-functions";
import mongoose, { Types } from 'mongoose';
import AnalyticsModel from './models/Analytics';
import TaskQueueItemModel from './models/TaskQueueItem';
import NFTModel from './models/NFT';
import ContractModel from './models/Contract';
import CheckpointModel from './models/Checkpoints';

const APP_PORT = 4000;
dotenv.config()
const api = express();
api.use(cors({ origin: true }));

// Middleware for Express 
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

const database = initMongo();

// AWS Settings
config.update({
    region: "us-east-1",
})

const sqs = new SQS();

function checkField(field: string | Types.ObjectId): boolean {
    return field != null;
}

function isValidNFT(nft: NFT): boolean {
    try {
        if (
            checkField(nft.id) &&
            checkField(nft.contractAddress) &&
            checkField(nft.tokenId) &&
            checkField(nft.media) &&
            checkField(nft.tokenURI) &&
            !isNaN(nft.milvusId) &&
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


api.get("/api/analytics/get" , async (req, res) => {
    try{
        const analyticsDocument = await AnalyticsModel.find({}).exec();

        if (analyticsDocument){
            res.status(200).json({
                success: true,
                ...analyticsDocument
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
        const taskQueueItems = await TaskQueueItemModel.find({status: TaskQueueStatus.IN_PROGRESS}).exec();
        res.status(200).json({
            success: true,
            items: taskQueueItems,
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

api.post("/api/nfts/add", async (req, res) => {
    try {
        const nft: NFT = req.body;
        const valid = isValidNFT(nft);

        if (!valid) {
            throw new Error("Invalid NFT Data")
        }

        const createdNFT = await NFTModel.create(nft);

        res.status(200).json({
            "success": true,
            "data": createdNFT
        });

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

api.post("/api/contracts/add", async (req, res) => {
    try {
        const contract: Contract = req.body;
        const valid = isValidContract(contract);

        if (!valid) {
            throw new Error("Invalid Contract Data")
        }

        const createdContract = await ContractModel.create(contract);

        res.status(200).json({
            "success": true,
            "data": createdContract
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
        const tQItem: TaskQueueItem = req.body.itemToAdd;
        const valid = isValidTaskQueueItem(tQItem);

        if (!valid) {
            throw new Error("Invalid TaskQueueItem Data")
        }

        const createdTaskQueueItem = await TaskQueueItemModel.create(tQItem);
        addTaskIdSQS(createdTaskQueueItem.id);
        res.status(200).json({
            "success": true,
            "data": createdTaskQueueItem
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

api.get("/api/contracts/last/get", async(req, res) => {
    const contractCheckpoint = await CheckpointModel.find({});
    if (contractCheckpoint){
        res.status(200).json({
            "success": true,
            "lastContract": contractCheckpoint[0].lastContract
        });
    } else {
        res.status(400).json({
            success: false,
            error: "Could not retrieve checkpoint data"
        });
    }
});

api.post("/api/contracts/last/update", async(req, res) => {
    const newContract = req.body.newContract;
    const checkpoint = await CheckpointModel.findOneAndUpdate({}, {contract: newContract});
    res.status(200).json({
        success: true,
        checkpointData: checkpoint,
    });
});

function addTaskIdSQS(taskId: string) {
    const params = {
        QueueUrl: process.env.JOB_SQS_URL as string,
        DelaySeconds: 0,
        MessageAttributes: {
            'TaskId': {
                'DataType': 'String',
                'StringValue': taskId
            },
        },
        MessageBody: taskId
    };

    sqs.sendMessage(params).send();
}

async function initMongo(){
    const database = await mongoose.connect((process.env.MONGO_DB_URL + "/universal-nft-vector-database") as string);
    return database;
}

api.listen(APP_PORT, () => {
    console.log(`api listening at http://localhost:${APP_PORT}`);
});

exports.api = functions.https.onRequest(api);
