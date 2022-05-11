import { Contract, NFT, TaskQueueItem, TaskQueueType } from "./Types";

const mockContract: Contract = {
        id: "2e6e7919-d905-4c78-8fca-d13bb9de28be",
        address: "No Items are Currently In the Task Queue",
        name: "Cryptopunks",
    } as Contract;

const mockTaskQueueItem: TaskQueueItem = {
            id: "2e6e7919-d905-4c78-8fca-d13bb9de28be",
            type: TaskQueueType.ITEM_CONTRACT,
            import: new Date(),
            data: mockContract
        } as TaskQueueItem;

const mockNFT: NFT = {
    id: "0x0080313cfc8a816348092290f2ce8d348c265d5a9dd9878ee019232245422fc9",                     // id and transactionId are the same
    transactionId: "0x0080313cfc8a816348092290f2ce8d348c265d5a9dd9878ee019232245422fc9",
    contractAddress: "0x0000000000001b84b1cb32787b0d64758d019317",
    mintTime: new Date(),
    tokenId: 10,
    owner: "0x387a7e54781E32C253DE17C4E99b0E16f70eD59a",
    media: "https://ipfs.io/ipfs/QmVdxTPraJKZskdfFk1kwCWXo6JUwhLRY95M7b1ZUDWxB6", 
    tokenURI: "https://ipfs.io/ipfs/QmYzZZEp7hCS5GnQG4Rw4Loa33EoMYXUx2fgzPT14d2s5V",
} as NFT;

export {mockContract, mockTaskQueueItem, mockNFT};
