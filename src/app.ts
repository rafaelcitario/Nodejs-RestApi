import fastify from 'fastify'

import { transactions } from './routes/transactions'
import cookies from '@fastify/cookie'
export const app = fastify()

app.register(cookies)

app.register(transactions, {
  prefix: 'transactions',
})
