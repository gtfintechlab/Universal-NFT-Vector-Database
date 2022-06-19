import { BlockchainType, Contract, NFTType, TaskQueueItem, TaskQueueStatus, TaskQueueType } from "../utils/Types";
import { Client, createClient, gql } from "urql";
import { addToTaskQueue, getLastContract, updateLastContract } from "./Firebase";
import { firebaseId } from "../utils/FirebaseId";

const EIP_721_SUBGRAPH = "https://api.thegraph.com/subgraphs/name/wighawag/eip721-subgraph";
const client: Client = createClient({
    url: EIP_721_SUBGRAPH,
  });

export async function getNextContracts(lastContract: string, amount: number){
    const contractAddressQuery = gql(`
    query{
        tokenContracts(first: ${amount}, where: {id_gt: "${lastContract}"}) {
          id
          name
        }
      }      
    `);

    const queryResult = await client.query(contractAddressQuery).toPromise();

    return queryResult.data.tokenContracts;
}

export async function processNextContracts(amount=10, nftType=NFTType.ERC_721, chain=BlockchainType.ETHEREUM){
    const lastContract = await getLastContract();
    if (lastContract != null){
        const nextContracts = await getNextContracts(lastContract, amount);

        let index = 0;
        let newLastContract = "";

        for (const contract of nextContracts){
            const contractToAdd = {
                type: TaskQueueType.ITEM_CONTRACT,
                status: TaskQueueStatus.IN_PROGRESS,
                data: {
                    address: contract.id,
                    name: contract.name,
                    type: nftType,
                    chain: chain
                } as Contract
            } as TaskQueueItem;

            await addToTaskQueue(contractToAdd);

            if (index === nextContracts.length - 1){
                newLastContract = contract.id
            };

            index += 1;
        };
        await updateLastContract(newLastContract);
    }
}
