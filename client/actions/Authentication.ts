import axios from 'axios'

export const getJWTToken = async (username, password) => {
  const token = await axios.post('/api/auth/getToken', {
    username,
    password
  })

  if (token?.data?.success) {
    return token.data
  } else {
    throw new Error('Failed to Retrieve JWT Token!')
  }
}

export const verifyJWTToken = async (token) => {
  const verification = await axios.post('/api/auth/verify', {
    token
  })

  if (verification?.data?.success) {
    return verification.data
  } else {
    throw new Error('Failed to Verify JWT Token!')
  }
}
