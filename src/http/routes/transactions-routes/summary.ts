import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../../middlewares/check-sessionId-exists'
import { knex } from '../../../database'

export async function summaryTransaction(app: FastifyInstance) {
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
