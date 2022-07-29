import axios from "axios"
import { urls } from "~~/utils/Config"

export const getLastContract = async () => {
    const lastContract = await axios.get(
        urls.api.server.localhost + '/api/contracts/last/get'
      )
    
      if (lastContract?.data?.success) {
        return lastContract.data;
      } else {
        throw new Error('Failed to get Last Contract!')
      }
    
}

export const updateLastContract = async (newContract) => {
    const updateContract = await axios.post(
        urls.api.server.localhost + '/api/contracts/last/update',
        {
            newContract: newContract
        }
      )
    
      if (updateContract?.data?.success) {
        return updateContract.data;
      } else {
        throw new Error('Failed to update Last Contract!')
      }
}