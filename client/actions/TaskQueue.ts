import axios from 'axios'

export const getNftAmountTaskQueue = async () => {
  const nftAmount = await axios.get('/api/taskQueue/nfts/amount')

  if (nftAmount?.data?.success) {
    return nftAmount.data
  } else {
    throw new Error('Failed to Retrieve NFT Count in Task Queue!')
  }
}

export const getCollectionAmountTaskQueue = async () => {
  const nftAmount = await axios.get('/api/taskQueue/contracts/amount')

  if (nftAmount?.data?.success) {
    return nftAmount.data
  } else {
    throw new Error('Failed to Retrieve NFT Collection Count in Task Queue!')
  }
}

export const addItemToTaskQueue = async (itemToAdd, jwtToken) => {
  const taskQueueAdd = await axios.post('/api/taskQueue/add', {
    item: itemToAdd,
    token: jwtToken
  })

  if (taskQueueAdd?.data?.success) {
    return taskQueueAdd.data
  } else {
    throw new Error('Failed to add item to task queue!')
  }
}

export const getTaskQueueItems = async () => {
  const taskQueueItems = await axios.get('/api/taskQueue/get')

  if (taskQueueItems?.data?.success) {
    return taskQueueItems.data
  } else {
    throw new Error('Failed to load task queue items!')
  }
}
