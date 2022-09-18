import AnalyticsModel from '~~/server/db/Analytics'
import dbConnect from '~~/server/utils/dbConnect'

export default defineEventHandler(async (event) => {
  try {
    await dbConnect()
    let analyticsDocument = await AnalyticsModel.findOne({}).exec()

    if (!analyticsDocument) {
      const insertAnalytics = await AnalyticsModel.create({})
      analyticsDocument = insertAnalytics
    }
    return {
      success: true,
      ...analyticsDocument.toObject()
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
