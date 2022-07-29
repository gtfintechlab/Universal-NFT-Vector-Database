import axios from 'axios'
import { urls } from '../utils/Config'

export const searchClosestNFTs = async  (image: String,amount: Number, 
                                        withVector: Boolean, withMetadata: Boolean ) => { 
    const searchResult = await axios.post(
        urls.api.search.hosted + '/api/search',
        {
            image: image,
            amount: amount,
            withVector: withVector,
            withMetadata: withMetadata
        }
    )

    if (searchResult?.data) {
        return searchResult.data
    } else {
        throw new Error('Search API Failed to Retrieve Closest NFTs!')
    }
}

export const getMultidimensionalScaling = async (vectors) => {
    const mdsResult = await axios.post(
        urls.api.search.hosted + '/api/mds',
        {
            vectors: vectors,
        }
    )

    if (mdsResult?.data) {
        return mdsResult.data;
    } else {
        throw new Error('Multidimensional Scaling Failed!')
    }

}