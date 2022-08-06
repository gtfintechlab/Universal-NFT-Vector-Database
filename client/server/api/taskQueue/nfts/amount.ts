import TaskQueueItemModel from '~~/server/db/TaskQueueItem'
import { TaskQueueStatus, TaskQueueType } from '~~/utils/Types'
import dbConnect from '~~/server/utils/dbConnect';

export default defineEventHandler(async (event) => {
  try {
    await dbConnect();
    const nftTaskQueue = await TaskQueueItemModel.find({
      status: TaskQueueStatus.IN_PROGRESS,
      type: TaskQueueType.ITEM_NFT
    }).exec()

    return {
      success: true,
      amount: nftTaskQueue.length
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
