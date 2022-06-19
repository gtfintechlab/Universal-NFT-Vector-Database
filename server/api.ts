import express from 'express';
import bodyParser from 'body-parser';
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
import { waterfall } from 'async';

const APP_PORT = 4000;
dotenv.config()
const api = express();
api.use(cors());

// Middleware for Express 
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

// AWS Settings
config.update({
    region: "us-east-1",
})

const sqs = new SQS();
let client: typeof mongoose | null;

function checkField(field: string | Types.ObjectId): boolean {
    return field != null;
}

function isValidNFT(nft: NFT): boolean {
    try {
        if (
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
        (Object.values(TaskQueueType).includes(taskQueueItem.type)) &&
        (Object.values(TaskQueueStatus).includes(taskQueueItem.status)) &&
        ((isValidNFT(taskQueueItem.data as NFT) && taskQueueItem.type === TaskQueueType.ITEM_NFT) || 
        (isValidContract(taskQueueItem.data as Contract) && taskQueueItem.type === TaskQueueType.ITEM_CONTRACT))
    ) {
        return true
    }
    return false
}

async function initMongo(){
    if (!client) {
        const MONGO_URL = process.env.ENVIRONMENT === "development" ? "mongodb://127.0.0.1:27017/" : process.env.MONGO_DB_URL;
        client = await mongoose.connect((MONGO_URL + 
            "universal-nft-vector-database") as string, {
            socketTimeoutMS: 360000
        });
        functions.logger.log("Connected to MongoDB");
      } else {
        functions.logger.log("Using existing MongoDB connection");
      }
      functions.logger.log("Returning client");
      return client;
}

function applyWaterfall(functionToExecute: Function){
    waterfall([
        async function(callback: Function){
            const database = await initMongo();
            await callback(null, functionToExecute, database);
        },
        async function (functionExecution: Function, database: typeof mongoose, callback: Function){
            await functionExecution();
            await callback(null, database);
        },
        async function (database: typeof mongoose, callback: Function){
            functions.logger.log("Number of Connections: " + database.connections.length)
        }
    ], () => {})
}

api.get("/api/analytics/get" , async (req, res) => {
    async function getAnalytics(){
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
        }

    applyWaterfall(getAnalytics);
});

api.get("/api/taskQueue/get", async (req, res) => {
    async function getTaskQueue(){
        const taskQueueItems = await TaskQueueItemModel.find({status: TaskQueueStatus.IN_PROGRESS}).exec();
        if (taskQueueItems != null){
            res.status(200).json({
                success: true,
                items: taskQueueItems,
            });
        } else{
            res.status(400).json({
                success: false,
                error: "Something went wrong -- please try again!"
            });    
        }
    }

    applyWaterfall(getTaskQueue);
})

api.get("/", (req, res) => {
    res.status(200).json({
        "Hello": "World"
    });
});

api.post("/api/nfts/add", async (req, res) => {
    async function addNFT(){
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
            });
        }
    }
    applyWaterfall(addNFT);
});

api.post("/api/contracts/add", async (req, res) => {
    async function addContract(){
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
            });
        }    
    }
    applyWaterfall(addContract)
});

api.post("/api/taskQueue/add", async (req, res) => {
    async function addTaskQueue(){
        try {
            const tQItem: TaskQueueItem = req.body;
            const valid = isValidTaskQueueItem(tQItem);
            
            if (!valid) {
                throw new Error("Invalid TaskQueueItem Data")
            }
    
            const createdTaskQueueItem = await TaskQueueItemModel.create(tQItem);
            addTaskIdSQS(createdTaskQueueItem._id.toString());
            res.status(200).json({
                "success": true,
                "data": createdTaskQueueItem
            });
        } catch (error) {
            let message
    
            if (error instanceof Error) message = error.message
            else message = String(error)
            res.status(400).json({
                "success": false,
                "error": message
            });
        }    
    }

    applyWaterfall(addTaskQueue);
});

api.get("/api/contracts/last/get", async(req, res) => {
    async function getLastContract(){
        const contractCheckpoint = await CheckpointModel.findOne({});
        if (contractCheckpoint != null){
            res.status(200).json({
                "success": true,
                "lastContract": contractCheckpoint.lastContract
            });
        } else {
            res.status(400).json({
                success: false,
                error: "Could not retrieve checkpoint data"
            });
    
        }
    }

    applyWaterfall(getLastContract);
});

api.post("/api/contracts/last/update", async(req, res) => {
    async function updateLastContract(){
        const newContract = req.body.newContract;
        const checkpoint = await CheckpointModel.findOneAndUpdate({}, {lastContract: newContract});
        res.status(200).json({
            success: true,
            checkpointData: checkpoint,
        });    
    }
    applyWaterfall(updateLastContract);
});

api.get("/api/database/reset", async(req, res) => {
    async function resetDatabase(){
        if (process.env.MONGO_DB_URL === "mongodb://127.0.0.1:27017/" && process.env.ENVIRONMENT === "development"){
            await ContractModel.deleteMany({});
            await NFTModel.deleteMany({});
            await TaskQueueItemModel.deleteMany({});
            await CheckpointModel.findOneAndUpdate({}, {
                lastContract: ""
            });
    
            await AnalyticsModel.findOneAndUpdate({}, {
                totalContracts: 0,
                totalERC1155: 0,
                totalERC721: 0,
                totalEthereumNFTs: 0,
                totalNFTs: 0
            });
        }
        res.status(200).json({
            success: true,
        });    
    }
    applyWaterfall(resetDatabase);
})

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

api.listen(APP_PORT, () => {
    console.log(`api listening at http://localhost:${APP_PORT}`);
});

exports.api = functions.https.onRequest(api);
