import axios from 'axios'
import { getLastContract, updateLastContract } from './Checkpoint'
import { addItemToTaskQueue } from './TaskQueue'
import { urls } from '~~/utils/Config'
import { BlockchainType, NFTType, TaskQueueStatus, TaskQueueType } from '~~/utils/Types'
import { verifyJWTToken } from './Authentication'

export const getNextContracts = async (lastContract: string, amount: number) => {
  const query = `query{
                        tokenContracts(first: ${amount}, where: {id_gt: "${lastContract}"}) {
                            id
                            name
                        }
                    }`
  const queryResult = await axios.post(urls.api.graphprotocol.hosted, { query })
  if (queryResult?.data) {
    return queryResult.data.data
  } else {
    throw new Error('Failed to query for next contracts')
  }
}

export const processNextContracts = async (jwtToken, amount, nftType, chain) => {
  const verifyToken = await verifyJWTToken(jwtToken);
  if (!(verifyToken.authenticated)){
    throw new Error("Failed to Verify User is Authenticated")
  }
  
  const lastContract = await getLastContract()
  let newLastContract = ''

  if (lastContract?.success) {
    const nextContracts = (await getNextContracts(lastContract.lastContract, amount)).tokenContracts

    for (const [index, contract] of nextContracts.entries()) {
      const contractToAdd = {
        type: TaskQueueType.ITEM_CONTRACT,
        status: TaskQueueStatus.IN_PROGRESS,
        data: {
          address: contract.id,
          name: contract.name,
          type: nftType,
          chain
        }
      }
      await addItemToTaskQueue(contractToAdd, jwtToken)

      if (index === nextContracts.length - 1) {
        newLastContract = contract.id
      };
    }
    await updateLastContract(newLastContract, jwtToken)
  }
}
