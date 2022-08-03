import mongoose from "mongoose";
import CheckpointModel from "~~/server/db/Checkpoints";

export default defineEventHandler(async (event) => {

    const secrets = useRuntimeConfig().secretVariables;
    await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database');
    let contractCheckpoint = await CheckpointModel.findOne({});

    if (!contractCheckpoint){
        const newCheckpoint = await CheckpointModel.create({})
        contractCheckpoint = newCheckpoint;
    }

    await mongoose.connection.close();
    return {
        success: true,
        lastContract: contractCheckpoint.lastContract,
    }

  })