import mongoose, {Schema} from "mongoose";
import {NFT} from "../Types";

const NFTSchema = new Schema<NFT>(
    {
      contractAddress: {
        type: String,
        required: true,
      },
      tokenId: {
        type: String,
        required: true,
      },
      media: {
        type: String,
        required: true,
      },
      tokenURI: {
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
      vectorId: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  NFTSchema.statics.hasNoDependencies = () => true;

  const NFTModel = (mongoose.models.NFT as mongoose.Model<NFT> || mongoose.model<NFT>("NFT", NFTSchema));

  export default NFTModel;