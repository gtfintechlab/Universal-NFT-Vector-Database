import mongoose, { Schema } from "mongoose";

const AnalyticsSchema = new Schema(
    {
      totalContracts: {
        type: Number,
        required: true
      },
      totalERC1155: {
        type: Number,
        required: true
      },
      totalERC721: {
        type: Number,
        required: true
      },
      totalEthereumNFTs: {
        type: Number,
        required: true
      },
      totalNFTs: {
        type: Number,
        required: true
      },
    }
);

AnalyticsSchema.statics.hasNoDependencies = () => true;

const AnalyticsModel = mongoose.model("Analytics", AnalyticsSchema);

export default AnalyticsModel;
