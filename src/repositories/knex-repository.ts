export class TransactionRepository {
  create() {
    await knex('transactions').where('sessionId', sessionId).select('*')
  }
}
