import { randomUUID } from 'node:crypto'
import { knex } from '../../database'
import {
  IDataTransactionCreate,
  IKnexRepositoryCreateTransaction,
} from './IRepositories/knex-repository'

export class CreateTransactionRepository
  // eslint-disable-next-line prettier/prettier
  implements IKnexRepositoryCreateTransaction {
  async create(data: IDataTransactionCreate): Promise<void> {
    const randomId = randomUUID()
    const { name, amount, type } = data
    await knex('transactions')
      .insert({
        id: randomId,
        name,
        amount: type === 'credit' ? amount : amount * -1,
        type,
        sessionId: randomId,
      })
      .returning('*')
  }
}
