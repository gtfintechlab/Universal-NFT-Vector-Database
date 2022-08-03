import mongoose from "mongoose";
import { TaskQueueItem } from '../../utils/Types';

const TaskQueueItemSchema = new mongoose.Schema<TaskQueueItem>(
    {
      type: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  TaskQueueItemSchema.statics.hasNoDependencies = () => true;

  const TaskQueueItemModel = (mongoose.models.TaskQueueItem as mongoose.Model<TaskQueueItem> || mongoose.model<TaskQueueItem>("TaskQueueItem", TaskQueueItemSchema));

  export default TaskQueueItemModel;