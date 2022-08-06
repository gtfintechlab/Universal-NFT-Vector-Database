import {hashString} from '../../utils/Auth';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    const secrets = useRuntimeConfig().secretVariables
    const requestBody = await useBody(event);
    const user = `${requestBody.username}${requestBody.password}`;
    const hashed = hashString(user, secrets.SERVER_SECRET)
    if (hashed !== secrets.HASHED_PASSWORD){
        throw Error(`Unable to Authorize Token for User ${requestBody.username}`);
    }

    const webToken = jwt.sign({authenticated: true}, secrets.SERVER_SECRET)
    return {
      success: true,
      jwt: webToken
    }
  } catch (exception) {
    throw createError({ statusCode: 500, message: exception, data: { success: false } })
  }
})
