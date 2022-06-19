import mongoose, { Schema } from "mongoose";

const CheckpointSchema = new Schema(
    {
      lastContract: {
        type: String,
        required: true
      }
    }
);

CheckpointSchema.statics.hasNoDependencies = () => true;

const CheckpointModel = mongoose.model("Checkpoint", CheckpointSchema);

export default CheckpointModel;
