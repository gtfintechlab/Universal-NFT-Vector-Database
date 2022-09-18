import CheckpointModel from '~~/server/db/Checkpoints'
import { verifyJWT } from '~~/server/utils/Auth'
import dbConnect from '~~/server/utils/dbConnect'

export default defineEventHandler(async (event) => {
  try {
    const requestBody = (await useBody(event))
    const newContract = requestBody.newContract
    const token = requestBody.token
    const authenticated = verifyJWT(token).authenticated

    if (!authenticated) {
      throw new Error('Failed to Verify User is Authenticated')
    }

    await dbConnect()

    const checkpoint = await CheckpointModel.findOneAndUpdate({}, { lastContract: newContract })

    return {
      success: true,
      lastContract: checkpoint
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
