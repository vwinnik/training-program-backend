import getAccessToken from './get_access_token'
import decodeToken from './decode_token'

async function getAuthProviderCurrentUserId () {
  const accessToken = getAccessToken()
  const authProviderCurrentUserId = accessToken && await decodeToken(accessToken)

  return authProviderCurrentUserId
}

export default getAuthProviderCurrentUserId
