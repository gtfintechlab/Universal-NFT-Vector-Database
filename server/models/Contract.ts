import mongoose, {Schema} from "mongoose";
import {Contract} from "../Types";

const ContractSchema = new Schema<Contract>(
    {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      chain: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  ContractSchema.statics.hasNoDependencies = () => true;

  const ContractModel = (mongoose.models.Contract as mongoose.Model<Contract> || mongoose.model<Contract>("Contract", ContractSchema));

  export default ContractModel;