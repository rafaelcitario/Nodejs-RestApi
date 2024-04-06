import { app } from '../../app'
import { createTransactionRoute } from './transactions-routes/create'
import { listAllTransactions } from './transactions-routes/listAll'
import { listOneTransaction } from './transactions-routes/listOne'
import { updateTransaction } from './transactions-routes/update'
import { deleteTransaction } from './transactions-routes/delete'
import { summaryTransaction } from './transactions-routes/summary'

export async function transactionRoutes() {
  app.register(createTransactionRoute, {
    prefix: 'transactions',
  })
  app.register(listAllTransactions, {
    prefix: 'transactions',
  })
  app.register(listOneTransaction, {
    prefix: 'transactions',
  })
  app.register(updateTransaction, {
    prefix: 'transactions',
  })

  app.register(deleteTransaction, {
    prefix: 'transactions',
  })
  app.register(summaryTransaction, {
    prefix: 'transactions',
  })
}
