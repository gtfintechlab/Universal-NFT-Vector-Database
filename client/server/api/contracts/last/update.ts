import mongoose from 'mongoose'
import CheckpointModel from '~~/server/db/Checkpoints'

export default defineEventHandler(async (event) => {
  try {
    const requestBody = (await useBody(event));
    const newContract = requestBody.newContract;
    const token = requestBody.token;

    if (!(token.authenticated)){
      throw new Error("Failed to Verify User is Authenticated")
    }

    const secrets = useRuntimeConfig().secretVariables
    await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database')

    const checkpoint = await CheckpointModel.findOneAndUpdate({}, { lastContract: newContract })

    await mongoose.connection.close()
    return {
      success: true,
      lastContract: checkpoint
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
