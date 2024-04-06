import { transactionRoutes } from './http/routes/transactions'
import { fastify, cookies } from './lib/fastify'

export const app = fastify()
app.register(cookies)
app.register(transactionRoutes)
