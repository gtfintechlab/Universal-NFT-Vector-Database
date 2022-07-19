import { BlockchainType, Contract, NFT, NFTType, TaskQueueItem, TaskQueueStatus, TaskQueueType } from "./Types";

const mockContract: Contract = {
        id: "2e6e7919-d905-4c78-8fca-d13bb9de28be",
        address: "No Items are Currently In the Task Queue",
        name: "Cryptopunks",
        type: NFTType.ERC_721,
        chain: BlockchainType.ETHEREUM
    } as Contract;

const mockTaskQueueItem: TaskQueueItem = {
            id: "2e6e7919-d905-4c78-8fca-d13bb9de28be",
            type: TaskQueueType.ITEM_NOT_APPLICABLE,
            import: new Date(),
            status: TaskQueueStatus.IN_PROGRESS,
            data: mockContract
        } as TaskQueueItem;

const mockNFT: NFT = {
    id: "0x0080313cfc8a816348092290f2ce8d348c265d5a9dd9878ee019232245422fc9",
    contractAddress: "0x0000000000001b84b1cb32787b0d64758d019317",
    tokenId: "0x10",
    media: "https://ipfs.io/ipfs/QmVdxTPraJKZskdfFk1kwCWXo6JUwhLRY95M7b1ZUDWxB6", 
    tokenURI: "https://ipfs.io/ipfs/QmYzZZEp7hCS5GnQG4Rw4Loa33EoMYXUx2fgzPT14d2s5V",
    chain: BlockchainType.ETHEREUM,
    type: NFTType.ERC_721,
    vectorId: 4685408067
} as NFT;

export {mockContract, mockTaskQueueItem, mockNFT};
