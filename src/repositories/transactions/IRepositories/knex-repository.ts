export interface IDataTransactionCreate {
  name: string
  amount: number
  type: string
  sessionId: string
}

export interface IKnexRepositoryCreateTransaction {
  create: (data: IDataTransactionCreate) => Promise<void>
}
