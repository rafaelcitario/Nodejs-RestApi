import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateTransactionRepository } from '../../repositories/transactions/createTransaction.repository'
import { randomUUID } from 'crypto'
import z from '../../lib/zod'
import { TransactionRegister } from '../../services/transactionRegister'

export async function createTransaction(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
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
  const transactionRepository = new CreateTransactionRepository()
  const registerTransaction = new TransactionRegister(transactionRepository)

  registerTransaction.execute({
    name,
    amount,
    type,
    sessionId,
  })
  reply.status(201).send()
}
