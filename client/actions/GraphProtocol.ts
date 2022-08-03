import axios from 'axios'
import { getLastContract, updateLastContract } from './Checkpoint'
import { addItemToTaskQueue } from './TaskQueue'
import { urls } from '~~/utils/Config'
import { BlockchainType, NFTType, TaskQueueStatus, TaskQueueType } from '~~/utils/Types'

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

export const processNextContracts = async (amount = 10, nftType = NFTType.ERC_721, chain = BlockchainType.ETHEREUM) => {
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
      await addItemToTaskQueue(contractToAdd)

      if (index === nextContracts.length - 1) {
        newLastContract = contract.id
      };
    }
    await updateLastContract(newLastContract)
  }
}
