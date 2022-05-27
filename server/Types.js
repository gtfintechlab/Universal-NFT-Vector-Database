"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskQueueStatus = exports.TaskQueueType = exports.NFTType = exports.BlockchainType = void 0;
var BlockchainType;
(function (BlockchainType) {
    BlockchainType["ETHEREUM"] = "ethereum";
    BlockchainType["POLYGON"] = "polygon";
})(BlockchainType = exports.BlockchainType || (exports.BlockchainType = {}));
var NFTType;
(function (NFTType) {
    NFTType["ERC_721"] = "ERC721";
    NFTType["ERC_1155"] = "ERC1155";
})(NFTType = exports.NFTType || (exports.NFTType = {}));
var TaskQueueType;
(function (TaskQueueType) {
    TaskQueueType["ITEM_CONTRACT"] = "contract";
    TaskQueueType["ITEM_NFT"] = "nft";
    TaskQueueType["ITEM_NOT_APPLICABLE"] = "N/A";
})(TaskQueueType = exports.TaskQueueType || (exports.TaskQueueType = {}));
var TaskQueueStatus;
(function (TaskQueueStatus) {
    TaskQueueStatus["IN_PROGRESS"] = "in progress";
    TaskQueueStatus["SUCCESS"] = "success";
    TaskQueueStatus["FAILURE"] = "failure";
})(TaskQueueStatus = exports.TaskQueueStatus || (exports.TaskQueueStatus = {}));
;
