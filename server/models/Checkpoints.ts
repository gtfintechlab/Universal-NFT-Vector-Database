import mongoose, { Schema } from "mongoose";

const CheckpointSchema = new Schema(
    {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      lastContract: {
        type: String,
        required: true
      }
    }
);

CheckpointSchema.statics.hasNoDependencies = () => true;

const CheckpointModel = mongoose.model("Checkpoint", CheckpointSchema);

export default CheckpointModel;
