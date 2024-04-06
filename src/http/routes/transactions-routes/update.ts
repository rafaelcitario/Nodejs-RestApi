import { FastifyInstance } from 'fastify'
import { knex } from '../../../database'
import { checkSessionIdExists } from '../../middlewares/check-sessionId-exists'
import z from '../../../lib/zod'

export async function updateTransaction(app: FastifyInstance) {
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
}
