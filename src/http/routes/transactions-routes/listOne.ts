import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../../middlewares/check-sessionId-exists'
import { knex } from '../../../database'
import z from '../../../lib/zod'

export async function listOneTransaction(app: FastifyInstance) {
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
}
