import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../../middlewares/check-sessionId-exists'
import { knex } from '../../../database'

export async function listAllTransactions(app: FastifyInstance) {
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
}
