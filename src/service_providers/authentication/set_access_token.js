import { requestNamespace } from '~/src/service_providers/cls_namespaces'

function setAccessToken (accessToken) {
  requestNamespace.set('accessToken', accessToken)
}

export default setAccessToken
