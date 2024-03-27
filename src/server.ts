import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.post('/hello', async () => {
  const transaction = knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'Pagamento de conta em POST',
      amout: 1000,
    })
    .returning('*')

  return transaction
})
app.get('/transactions-list', async () => {
  const transactions = await knex('transactions').select('*')
  return transactions
})

app.listen({ port: env.PORT, host: env.HOST }, () => {
  console.log('server is up!')
})
