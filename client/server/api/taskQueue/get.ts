import mongoose from "mongoose";
import TaskQueueItemModel from "~~/server/db/TaskQueueItem";
import { TaskQueueStatus } from "~~/utils/Types";

export default defineEventHandler(async (event) => {

    const secrets = useRuntimeConfig().secretVariables;
    await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database');
    const taskQueueItems = await TaskQueueItemModel.find(
        {status: TaskQueueStatus.IN_PROGRESS}
    ).exec();
    await mongoose.connection.close();
    return {
        success: true,
        items: taskQueueItems,
    }

  })