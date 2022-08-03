import mongoose from 'mongoose'
import CheckpointModel from '~~/server/db/Checkpoints'

export default defineEventHandler(async (event) => {
  try {
    const secrets = useRuntimeConfig().secretVariables
    await mongoose.connect(secrets.MONGO_DB_URL + 'universal-nft-vector-database')
    let contractCheckpoint = await CheckpointModel.findOne({})

    if (!contractCheckpoint) {
      const newCheckpoint = await CheckpointModel.create({})
      contractCheckpoint = newCheckpoint
    }

    await mongoose.connection.close()
    return {
      success: true,
      lastContract: contractCheckpoint.lastContract
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
