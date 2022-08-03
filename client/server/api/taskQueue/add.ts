import mongoose from 'mongoose'
import TaskQueueItemModel from '~~/server/db/TaskQueueItem'
import { verifyJWT } from '~~/server/utils/Auth'
import { addTaskIdSQS } from '~~/server/utils/SQS'
import { TaskQueueItem } from '~~/utils/Types'

export default defineEventHandler(async (event) => {
  try {
    const secrets = useRuntimeConfig().secretVariables
    const requestBody = await useBody(event)
    const tQItem: TaskQueueItem = requestBody.item;
    const token = requestBody.token;

    if (!(token.authenticated)){
      throw new Error("Failed to Verify User is Authenticated")
    }
    
    await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database')    
    const createdTaskQueueItem = await TaskQueueItemModel.create(tQItem)
    await addTaskIdSQS(createdTaskQueueItem._id.toString())

    await mongoose.connection.close()
    return {
      success: true,
      items: createdTaskQueueItem
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
