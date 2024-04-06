import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import z from '../../../lib/zod'
import { knex } from '../../../database'

export async function createTransactionRoute(
  app: FastifyInstance,
): Promise<void> {
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
}
