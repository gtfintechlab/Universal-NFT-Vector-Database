import axios from 'axios'
import { urls } from '../utils/Config'

export const getAnalytics = async () => {
  const analytics = await axios.get('/api/analytics/get')

  if (analytics?.data?.success) {
    return analytics.data
  } else {
    throw new Error('Analytics Failed to Load!')
  }
}
