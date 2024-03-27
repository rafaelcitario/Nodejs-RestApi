import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'
import { randomUUID } from 'crypto'
import { z } from 'zod'

const app = fastify()

app.post('/transactions/create', async (request, reply) => {
  const transanctionsBodySchema = z.object({
    name: z.string(),
    amount: z.number(),
    type: z.enum(['credit', 'debit']),
  })
  const { name, amount, type } = transanctionsBodySchema.parse(request.body)
  await knex('transactions').insert({
    id: randomUUID(),
    name,
    amount: type === 'credit' ? amount : amount * -1,
    type,
  })
  reply.status(201).send()
})

app.get('/transactions/list', async () => {
  const transactions = await knex('transactions').select('*')
  return transactions
})

app.get('/transactions/:id', async (request, reply) => {
  const getParamsTransactionSchema = z.object({
    id: z.string(),
  })
  const { id } = getParamsTransactionSchema.parse(request.params)
  const transaction = await knex('transactions').where('id', id).select('*')
  reply.status(200).send(transaction)
})

app.put('/transactions/:id', async (request, reply) => {
  const updateTransactionSchema = z.object({
    id: z.string(),
  })

  const bodyUpdateTransactionSchema = z.object({
    name: z.string().optional(),
    amount: z.number().optional(),
    type: z.string().optional(),
  })

  const { id } = updateTransactionSchema.parse(request.params)
  const { name, amount, type } = bodyUpdateTransactionSchema.parse(request.body)

  await knex('transactions').where('id', id).update({
    name,
    amount,
    type,
    updatedAt: knex.fn.now(),
  })

  reply.status(200).send()
})

app.delete('/transactions/:id', async (request, reply) => {
  const deleteBodySchema = z.object({
    id: z.string(),
  })

  const { id } = deleteBodySchema.parse(request.params)
  await knex('transactions').where('id', id).delete()

  reply.status(200).send('Deleted with success!')
})

app.listen({ port: env.PORT, host: env.HOST }, () => {
  console.log('server is up!')
})
