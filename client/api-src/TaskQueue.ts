import axios from 'axios'
import { urls } from '../utils/Config'

export const getNftAmountTaskQueue = async () => {
  const nftAmount = await axios.get(
    urls.api.server.localhost + '/api/taskQueue/nfts/amount'
  )

  if (nftAmount?.data?.success) {
    return nftAmount.data
  } else {
    throw new Error('Failed to Retrieve NFT Count in Task Queue!')
  }
}

export const getCollectionAmountTaskQueue = async () => {
  const nftAmount = await axios.get(
    urls.api.server.localhost + '/api/taskQueue/contracts/amount'
  )

  if (nftAmount?.data?.success) {
    return nftAmount.data
  } else {
    throw new Error('Failed to Retrieve NFT Collection Count in Task Queue!')
  }
}

export const addItemToTaskQueue = async (itemToAdd) => {
  const taskQueueAdd = await axios.post(
    urls.api.server.localhost + '/api/taskQueue/add', itemToAdd
  )

  if (taskQueueAdd?.data?.success) {
    return taskQueueAdd.data
  } else {
    throw new Error('Failed to add item to task queue!')
  }
}
