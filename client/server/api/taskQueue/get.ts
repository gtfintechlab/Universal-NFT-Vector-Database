import TaskQueueItemModel from '~~/server/db/TaskQueueItem'
import { TaskQueueStatus } from '~~/utils/Types'
import dbConnect from '~/server/utils/dbConnect';

export default defineEventHandler(async (event) => {
  try {
    await dbConnect();
    const taskQueueItems = await TaskQueueItemModel.find(
      { status: TaskQueueStatus.IN_PROGRESS }
    ).sort({'createdAt': 'asc'}).exec()
    return {
      success: true,
      items: taskQueueItems
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
