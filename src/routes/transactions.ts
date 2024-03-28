import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function transactions(app: FastifyInstance): Promise<void> {
  app.post('/create', async (request, reply) => {
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

  app.get('/list', async () => {
    const transactions = await knex('transactions').select('*')
    return transactions
  })

  app.get('/list/:id', async (request, reply) => {
    const getParamsTransactionSchema = z.object({
      id: z.string(),
    })
    const { id } = getParamsTransactionSchema.parse(request.params)
    const transaction = await knex('transactions')
      .where('id', id)
      .select('*')
      .first()
    reply.status(200).send(transaction)
  })

  app.put('/list/:id', async (request, reply) => {
    const updateTransactionSchema = z.object({
      id: z.string(),
    })

    const bodyUpdateTransactionSchema = z.object({
      name: z.string().optional(),
      amount: z.number().optional(),
      type: z.string().optional(),
    })

    const { id } = updateTransactionSchema.parse(request.params)
    const { name, amount, type } = bodyUpdateTransactionSchema.parse(
      request.body,
    )

    await knex('transactions')
      .where('id', id)
      .update({
        name,
        amount,
        type,
        updatedAt: knex.fn.now(),
      })
      .first()

    reply.status(200).send()
  })

  app.delete('/list/:id', async (request, reply) => {
    const deleteBodySchema = z.object({
      id: z.string(),
    })

    const { id } = deleteBodySchema.parse(request.params)
    await knex('transactions').where('id', id).delete()

    reply.status(200).send('Deleted with success!')
  })

  app.get('/summary', async (request, reply) => {
    const creditTransactions = await knex('transactions')
      .where('type', 'credit')
      .select()
    const debitTransactions = await knex('transactions')
      .where('type', 'debit')
      .select()
    const creditTransactionsSum = await knex('transactions')
      .where('type', 'credit')
      .sum('amount')
    const debitTransactionsSum = await knex('transactions')
      .where('type', 'debit')
      .sum('amount')

    const summary = {
      credit: {
        creditTransactions,
        creditTransactionsSum,
      },

      debit: {
        debitTransactions,
        debitTransactionsSum,
      },
    }

    reply.status(200).send(summary)
  })
}
