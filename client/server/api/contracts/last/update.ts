import mongoose from "mongoose";
import CheckpointModel from "~~/server/db/Checkpoints";

export default defineEventHandler(async (event) => {

    const secrets = useRuntimeConfig().secretVariables;
    await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database');

    const newContract = (await useBody(event)).newContract;
    const checkpoint = await CheckpointModel.findOneAndUpdate({}, {lastContract: newContract});

    await mongoose.connection.close();
    return {
        success: true,
        lastContract: checkpoint,
    }

  })