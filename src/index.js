import './set_working_directory'
import express from 'express'
import { createServer } from 'http'
import bodyParser from 'body-parser'
import cors from 'cors'

import createGraphQLServer from '~/src/service_providers/graphql/create_graphql_server'
import storeAccessTokenInAuthService from '~/src/authentication/middleware/store_access_token_in_auth_service'
import applyRequestNamespace from './service_providers/cls_namespaces/express_middleware.js'

const corsOriginsRegex = new RegExp(process.env.ALLOWED_CORS_ORIGINS_REGEX ?? /^\b$/)
const port = process.env.PORT || 3001
const app = express()

app.set('trust proxy', 1) // trust first proxy server
app.use(cors({
  origin: corsOriginsRegex,
  credentials: true
}))
app.use(bodyParser.json())
app.use(applyRequestNamespace)
app.use(storeAccessTokenInAuthService)

const server = createGraphQLServer(app)
const httpServer = createServer(app)

httpServer.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
  console.log(`Accepting requests whose origin matches: ${corsOriginsRegex}`)
})
