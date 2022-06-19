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
const Types_1 = require("./Types");
const aws_sdk_1 = require("aws-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const functions = __importStar(require("firebase-functions"));
const mongoose_1 = __importDefault(require("mongoose"));
const Analytics_1 = __importDefault(require("./models/Analytics"));
const TaskQueueItem_1 = __importDefault(require("./models/TaskQueueItem"));
const NFT_1 = __importDefault(require("./models/NFT"));
const Contract_1 = __importDefault(require("./models/Contract"));
const Checkpoints_1 = __importDefault(require("./models/Checkpoints"));
const async_1 = require("async");
const APP_PORT = 4000;
dotenv_1.default.config();
const api = (0, express_1.default)();
api.use((0, cors_1.default)());
// Middleware for Express 
api.use(body_parser_1.default.urlencoded({ extended: false }));
api.use(body_parser_1.default.json());
// AWS Settings
aws_sdk_1.config.update({
    region: "us-east-1",
});
const sqs = new aws_sdk_1.SQS();
let client;
function checkField(field) {
    return field != null;
}
function isValidNFT(nft) {
    try {
        if (checkField(nft.contractAddress) &&
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
        if (checkField(contract.address) &&
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
    if ((Object.values(Types_1.TaskQueueType).includes(taskQueueItem.type)) &&
        (Object.values(Types_1.TaskQueueStatus).includes(taskQueueItem.status)) &&
        ((isValidNFT(taskQueueItem.data) && taskQueueItem.type === Types_1.TaskQueueType.ITEM_NFT) ||
            (isValidContract(taskQueueItem.data) && taskQueueItem.type === Types_1.TaskQueueType.ITEM_CONTRACT))) {
        return true;
    }
    return false;
}
function initMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client) {
            const MONGO_URL = process.env.ENVIRONMENT === "development" ? "mongodb://127.0.0.1:27017/" : process.env.MONGO_DB_URL;
            client = yield mongoose_1.default.connect((MONGO_URL +
                "universal-nft-vector-database"), {
                socketTimeoutMS: 360000
            });
            functions.logger.log("Connected to MongoDB");
        }
        else {
            functions.logger.log("Using existing MongoDB connection");
        }
        functions.logger.log("Returning client");
        return client;
    });
}
function applyWaterfall(functionToExecute) {
    (0, async_1.waterfall)([
        function (callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const database = yield initMongo();
                yield callback(null, functionToExecute, database);
            });
        },
        function (functionExecution, database, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                yield functionExecution();
                yield callback(null, database);
            });
        },
        function (database, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                functions.logger.log("Number of Connections: " + database.connections.length);
            });
        }
    ], () => { });
}
api.get("/api/analytics/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function getAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const analyticsDocument = yield Analytics_1.default.find({}).exec();
            if (analyticsDocument) {
                res.status(200).json(Object.assign({ success: true }, analyticsDocument));
            }
            else {
                res.status(400).json({
                    success: false,
                    error: "Failed to retrieve Analytics"
                });
            }
        });
    }
    applyWaterfall(getAnalytics);
}));
api.get("/api/taskQueue/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function getTaskQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            const taskQueueItems = yield TaskQueueItem_1.default.find({ status: Types_1.TaskQueueStatus.IN_PROGRESS }).exec();
            if (taskQueueItems != null) {
                res.status(200).json({
                    success: true,
                    items: taskQueueItems,
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: "Something went wrong -- please try again!"
                });
            }
        });
    }
    applyWaterfall(getTaskQueue);
}));
api.get("/", (req, res) => {
    res.status(200).json({
        "Hello": "World"
    });
});
api.post("/api/nfts/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function addNFT() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nft = req.body;
                const valid = isValidNFT(nft);
                if (!valid) {
                    throw new Error("Invalid NFT Data");
                }
                const createdNFT = yield NFT_1.default.create(nft);
                res.status(200).json({
                    "success": true,
                    "data": createdNFT
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
        });
    }
    applyWaterfall(addNFT);
}));
api.post("/api/contracts/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function addContract() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contract = req.body;
                const valid = isValidContract(contract);
                if (!valid) {
                    throw new Error("Invalid Contract Data");
                }
                const createdContract = yield Contract_1.default.create(contract);
                res.status(200).json({
                    "success": true,
                    "data": createdContract
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
        });
    }
    applyWaterfall(addContract);
}));
api.post("/api/taskQueue/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function addTaskQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tQItem = req.body;
                const valid = isValidTaskQueueItem(tQItem);
                if (!valid) {
                    throw new Error("Invalid TaskQueueItem Data");
                }
                const createdTaskQueueItem = yield TaskQueueItem_1.default.create(tQItem);
                addTaskIdSQS(createdTaskQueueItem._id.toString());
                res.status(200).json({
                    "success": true,
                    "data": createdTaskQueueItem
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
        });
    }
    applyWaterfall(addTaskQueue);
}));
api.get("/api/contracts/last/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function getLastContract() {
        return __awaiter(this, void 0, void 0, function* () {
            const contractCheckpoint = yield Checkpoints_1.default.findOne({});
            if (contractCheckpoint != null) {
                res.status(200).json({
                    "success": true,
                    "lastContract": contractCheckpoint.lastContract
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    error: "Could not retrieve checkpoint data"
                });
            }
        });
    }
    applyWaterfall(getLastContract);
}));
api.post("/api/contracts/last/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function updateLastContract() {
        return __awaiter(this, void 0, void 0, function* () {
            const newContract = req.body.newContract;
            const checkpoint = yield Checkpoints_1.default.findOneAndUpdate({}, { lastContract: newContract });
            res.status(200).json({
                success: true,
                checkpointData: checkpoint,
            });
        });
    }
    applyWaterfall(updateLastContract);
}));
api.get("/api/database/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    function resetDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.MONGO_DB_URL === "mongodb://127.0.0.1:27017/" && process.env.ENVIRONMENT === "development") {
                yield Contract_1.default.deleteMany({});
                yield NFT_1.default.deleteMany({});
                yield TaskQueueItem_1.default.deleteMany({});
                yield Checkpoints_1.default.findOneAndUpdate({}, {
                    lastContract: ""
                });
                yield Analytics_1.default.findOneAndUpdate({}, {
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
        });
    }
    applyWaterfall(resetDatabase);
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
