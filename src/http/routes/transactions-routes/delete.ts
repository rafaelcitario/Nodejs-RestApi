import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../../middlewares/check-sessionId-exists'
import { knex } from '../../../database'
import z from '../../../lib/zod'

export async function deleteTransaction(app: FastifyInstance) {
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
}
