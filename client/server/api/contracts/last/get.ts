import CheckpointModel from '~~/server/db/Checkpoints'
import dbConnect from '~~/server/utils/dbConnect'

export default defineEventHandler(async (event) => {
  try {
    await dbConnect()
    let contractCheckpoint = await CheckpointModel.findOne({})

    if (!contractCheckpoint) {
      const newCheckpoint = await CheckpointModel.create({})
      contractCheckpoint = newCheckpoint
    }

    return {
      success: true,
      lastContract: contractCheckpoint.lastContract
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
