import TaskQueueItemModel from '~~/server/db/TaskQueueItem'
import { verifyJWT } from '~~/server/utils/Auth'
import { addTaskIdSQS } from '~/server/utils/SQS'
import { TaskQueueItem } from '~~/utils/Types'
import dbConnect from '~/server/utils/dbConnect';

export default defineEventHandler(async (event) => {
  try {
    const requestBody = await useBody(event)
    const tQItem: TaskQueueItem = requestBody.item;
    const token = requestBody.token;
    const authenticated = verifyJWT(token).authenticated;

    if (!authenticated){
      throw new Error("Failed to Verify User is Authenticated")
    }
    
    await dbConnect();
    const createdTaskQueueItem = await TaskQueueItemModel.create(tQItem)
    await addTaskIdSQS(createdTaskQueueItem._id.toString(), tQItem.type)

    return {
      success: true,
      items: createdTaskQueueItem
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
