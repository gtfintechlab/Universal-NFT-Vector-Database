import mongoose from 'mongoose'
import TaskQueueItemModel from '~~/server/db/TaskQueueItem'
import { TaskQueueStatus, TaskQueueType } from '~~/utils/Types'

export default defineEventHandler(async (event) => {
  try {
    const secrets = useRuntimeConfig().secretVariables
    await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database')

    const nftTaskQueue = await TaskQueueItemModel.find({
      status: TaskQueueStatus.IN_PROGRESS,
      type: TaskQueueType.ITEM_NFT
    }).exec()

    await mongoose.connection.close()
    return {
      success: true,
      amount: nftTaskQueue.length
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
