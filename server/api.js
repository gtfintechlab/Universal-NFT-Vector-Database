"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const firestore_1 = require("firebase-admin/firestore");
const app_1 = require("firebase-admin/app");
const process_1 = require("process");
const Types_1 = require("./Types");
const aws_sdk_1 = require("aws-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const functions = __importStar(require("firebase-functions"));
dotenv_1.default.config();
const api = (0, express_1.default)();
api.use((0, cors_1.default)({ origin: true }));
// Middleware for Express 
api.use(body_parser_1.default.urlencoded({ extended: false }));
api.use(body_parser_1.default.json());
const serviceAccount = require((0, process_1.cwd)() + '/firebase_credentials.json');
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
});
const database = (0, firestore_1.getFirestore)();
// AWS Settings
aws_sdk_1.config.update({
    region: "us-east-1",
});
const sqs = new aws_sdk_1.SQS();
function checkField(str) {
    if (str == null || str.length == 0) {
        return false;
    }
    return true;
}
function isValidNFT(nft) {
    try {
        if (checkField(nft.id) &&
            checkField(nft.contractAddress) &&
            checkField(nft.tokenId) &&
            checkField(nft.media) &&
            checkField(nft.tokenURI) &&
            !isNaN(nft.milvusId) &&
            (Object.values(Types_1.NFTType).includes(nft.type)) &&
            (Object.values(Types_1.BlockchainType).includes(nft.chain))) {
            return true;
        }
        return false;
    }
    catch (_a) {
        return false;
    }
}
function isValidContract(contract) {
    try {
        if (checkField(contract.id) &&
            checkField(contract.address) &&
            checkField(contract.name) &&
            (Object.values(Types_1.NFTType).includes(contract.type)) &&
            (Object.values(Types_1.BlockchainType).includes(contract.chain))) {
            return true;
        }
        return false;
    }
    catch (_a) {
        return false;
    }
}
function isValidTaskQueueItem(taskQueueItem) {
    if (checkField(taskQueueItem.id) &&
        (Object.values(Types_1.TaskQueueType).includes(taskQueueItem.type)) &&
        (Object.values(Types_1.TaskQueueStatus).includes(taskQueueItem.status)) &&
        (isValidNFT(taskQueueItem.data) || isValidContract(taskQueueItem.data))) {
        return true;
    }
    return false;
}
const APP_PORT = 4000;
api.get("/api/analytics/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const analyticsDocument = yield database.collection("analytics").doc("analytics").get();
        if (analyticsDocument.exists) {
            const analytics = analyticsDocument.data();
            res.status(200).json(Object.assign({ success: true }, analytics));
        }
        else {
            res.status(400).json({
                success: false,
                error: "Failed to retrieve Analytics"
            });
        }
    }
    catch (_a) {
        res.status(400).json({
            success: false,
            error: "Something went wrong -- please try again!"
        });
    }
}));
api.get("/api/taskQueue/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskQueueItems = yield database.collection("task_queue").where("status", "==", Types_1.TaskQueueStatus.IN_PROGRESS).get();
        const finalItems = [];
        taskQueueItems.forEach((item) => {
            finalItems.push(item.data());
        });
        res.status(200).json({
            success: true,
            items: finalItems,
        });
    }
    catch (_b) {
        res.status(400).json({
            success: false,
            error: "Something went wrong -- please try again!"
        });
    }
}));
api.get("/", (req, res) => {
    res.status(200).json({
        "Hello": "World"
    });
});
api.post("/api/nfts/addAll", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nft = req.body;
        const valid = isValidNFT(nft);
        if (!valid) {
            throw new Error("Invalid NFT Data");
        }
        yield database.collection("all_nfts").doc(nft.id).set(nft);
        res.status(200).json({
            "success": true,
            "data": nft
        });
    }
    catch (error) {
        let message;
        if (error instanceof Error) {
            message = error.message;
        }
        else {
            message = String(error);
        }
        res.status(400).json({
            "success": false,
            "error": message
        });
    }
}));
api.post("/api/contracts/addAll", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contract = req.body;
        const valid = isValidContract(contract);
        if (!valid) {
            throw new Error("Invalid Contract Data");
        }
        yield database.collection("all_contracts").doc(contract.id).set(contract);
        res.status(200).json({
            "success": true,
            "data": contract
        });
    }
    catch (error) {
        let message;
        if (error instanceof Error)
            message = error.message;
        else
            message = String(error);
        res.status(400).json({
            "success": false,
            "error": message
        });
    }
}));
api.post("/api/taskQueue/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tQItem = req.body.itemToAdd;
        const valid = isValidTaskQueueItem(tQItem);
        if (!valid) {
            throw new Error("Invalid TaskQueueItem Data");
        }
        yield database.collection("task_queue").doc(tQItem.id).set(tQItem);
        addTaskIdSQS(tQItem.id);
        res.status(200).json({
            "success": true,
            "data": tQItem
        });
    }
    catch (error) {
        let message;
        if (error instanceof Error)
            message = error.message;
        else
            message = String(error);
        res.status(400).json({
            "success": false,
            "error": message
        });
    }
}));
api.get("/api/contracts/last/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contractCheckpoint = yield database.collection("checkpoints").doc("contracts").get();
    if (contractCheckpoint.exists) {
        const checkpointData = contractCheckpoint.data();
        if (checkpointData) {
            res.status(200).json({
                "success": true,
                "lastContract": checkpointData.lastContract
            });
        }
        else {
            res.status(400).json({
                success: false,
                error: "Could not retrieve checkpoint data"
            });
        }
    }
    else {
        res.status(400).json({
            success: false,
            error: "Could not retrieve checkpoint"
        });
    }
}));
api.post("/api/contracts/last/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newContract = req.body.newContract;
    const checkpoint = database.collection("checkpoints").doc("contracts");
    const checkpointGet = yield checkpoint.get();
    if (checkpointGet.exists) {
        const checkpointData = checkpointGet.data();
        if (checkpointData) {
            checkpointData.lastContract = newContract;
            checkpoint.update(checkpointData);
        }
        res.status(200).json({
            success: true,
            checkpointData: checkpointData,
        });
    }
    else {
        res.status(400).json({
            success: true,
            error: "Failed to retrieve current checkpoint data",
        });
    }
}));
function addTaskIdSQS(taskId) {
    const params = {
        QueueUrl: process.env.JOB_SQS_URL,
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
