import { FastifyInstance } from 'fastify'
import { createTransaction } from '../../controllers/transactionCreate.controller'

export async function createTransactionRoute(
  app: FastifyInstance,
): Promise<void> {
  app.post('/create', createTransaction)
}
