import {
  IDataTransactionCreate,
  IKnexRepositoryCreateTransaction,
} from '../repositories/transactions/IRepositories/knex-repository'

export class TransactionRegister {
  private transactionRepository
  constructor(transactionRepository: IKnexRepositoryCreateTransaction) {
    this.transactionRepository = transactionRepository
  }

  async execute({ name, amount, type, sessionId }: IDataTransactionCreate) {
    await this.transactionRepository.create({
      name,
      amount,
      type,
      sessionId,
    })
  }
}
