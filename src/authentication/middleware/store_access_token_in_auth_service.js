import setAccessToken from '~/src/service_providers/authentication/set_access_token'

export default (req, res, next) => {
  // TODO: extract token from Express request
  const token = ''

  setAccessToken(token)
  next()
}
