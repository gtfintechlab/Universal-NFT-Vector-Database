import mongoose, { Schema } from "mongoose";

const AnalyticsSchema = new Schema(
    {
      totalContracts: {
        type: Number,
        required: true,
        default: 0
      },
      totalERC1155: {
        type: Number,
        required: true,
        default: 0
      },
      totalERC721: {
        type: Number,
        required: true,
        default: 0
      },
      totalEthereumNFTs: {
        type: Number,
        required: true,
        default: 0
      },
      totalNFTs: {
        type: Number,
        required: true,
        default: 0
      },
      contractsSuccess: {
        type: Number,
        required: true,
        default: 0
      },
      contractsFailure: {
        type: Number,
        required: true,
        default: 0
      },
      nftSuccess: {
        type: Number,
        required: true,
        default: 0
      },
      nftFailure: {
        type: Number,
        required: true,
        default: 0
      },
      searchApiSuccess: {
        type: Number,
        required: true,
        default: 0
      },
      searchApiFailure: {
        type: Number,
        required: true,
        default: 0
      }
    }
);

AnalyticsSchema.statics.hasNoDependencies = () => true;

const AnalyticsModel = mongoose.model("Analytics", AnalyticsSchema);

export default AnalyticsModel;
