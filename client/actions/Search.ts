import axios from 'axios'
import { urls } from '../utils/Config'

export const searchClosestNFTs = async (image: String, amount: Number,
  withVector: Boolean, withMetadata: Boolean) => {
  const searchResult = await axios.post(
    urls.api.search.hosted + '/api/search',
    {
      image,
      amount,
      withVector,
      withMetadata
    }
  )
  if (searchResult?.data?.success) {
    return searchResult.data
  } else {
    throw new Error('Search API Failed to Retrieve Closest NFTs!')
  }
}

export const getTSVD = async (vectors) => {
  const mdsResult = await axios.post(
    urls.api.search.hosted + '/api/tsvd',
    {
      vectors
    }
  )

  if (mdsResult?.data) {
    return mdsResult.data
  } else {
    throw new Error('TSNE Failed!')
  }
}
