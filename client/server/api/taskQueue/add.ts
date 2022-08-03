import mongoose from "mongoose";
import TaskQueueItemModel from "~~/server/db/TaskQueueItem";
import { addTaskIdSQS } from "~~/server/utils/SQS";
import { TaskQueueItem, TaskQueueStatus } from "~~/utils/Types";

export default defineEventHandler(async (event) => {
    const secrets = useRuntimeConfig().secretVariables;
    await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database');

    const tQItem: TaskQueueItem = await useBody(event);

    const createdTaskQueueItem = await TaskQueueItemModel.create(tQItem);
    await addTaskIdSQS(createdTaskQueueItem._id.toString());
    
    await mongoose.connection.close();
    return {
        success: true,
        items: createdTaskQueueItem
    }

  })