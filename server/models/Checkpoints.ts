import mongoose, { Schema } from "mongoose";

const CheckpointSchema = new Schema(
    {
      lastContract: {
        type: String,
        required: false,
        default: '',
      }
    }
);

CheckpointSchema.statics.hasNoDependencies = () => true;

const CheckpointModel = mongoose.model("Checkpoint", CheckpointSchema);

export default CheckpointModel;
