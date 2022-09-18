import { hashString, verifyJWT } from '../../utils/Auth'

export default defineEventHandler(async (event) => {
  try {
    const requestBody = await useBody(event)
    const token = requestBody.token

    const data = verifyJWT(token)

    return {
      success: true,
      authenticated: data.authenticated
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
