import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exists'

export async function transactions(app: FastifyInstance): Promise<void> {
  app.post('/create', async (request, reply) => {
    const transanctionsBodySchema = z.object({
      name: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    const { name, amount, type } = transanctionsBodySchema.parse(request.body)

    let { sessionId } = request.cookies
    if (!sessionId) {
      sessionId = randomUUID()
    }

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    await knex('transactions').insert({
      id: randomUUID(),
      name,
      amount: type === 'credit' ? amount : amount * -1,
      type,
      sessionId,
    })
    reply.status(201).send()
  })

  app.get(
    '/list',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const transactions = await knex('transactions')
        .where('sessionId', sessionId)
        .select('*')
      return transactions
    },
  )

  app.get(
    '/list/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const getParamsTransactionSchema = z.object({
        id: z.string(),
      })
      const { id } = getParamsTransactionSchema.parse(request.params)
      const transaction = await knex('transactions')
        .where({
          id,
          sessionId,
        })
        .select('*')
        .first()
      reply.status(200).send(transaction)
    },
  )

  app.put(
    '/list/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
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
        .where({
          id,
          sessionId,
        })
        .update({
          name,
          amount,
          type,
          updatedAt: knex.fn.now(),
        })

      reply.status(200).send()
    },
  )

  app.delete(
    '/list/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const deleteBodySchema = z.object({
        id: z.string(),
      })

      const { id } = deleteBodySchema.parse(request.params)
      await knex('transactions')
        .where({
          id,
          sessionId,
        })
        .delete()

      reply.status(200).send('Deleted with success!')
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const creditTransactions = await knex('transactions')
        .where({
          type: 'credit',
          sessionId,
        })
        .select()
        .first()
      const debitTransactions = await knex('transactions')
        .where({
          type: 'debit',
          sessionId,
        })
        .select()
        .first()
      const creditTransactionsSum = await knex('transactions')
        .where({
          type: 'credit',
          sessionId,
        })
        .sum('amount', { as: 'amount' })
        .first()
      const debitTransactionsSum = await knex('transactions')
        .where({
          type: 'debit',
          sessionId,
        })
        .sum('amount', { as: 'amount' })
        .first()

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
    },
  )
}
