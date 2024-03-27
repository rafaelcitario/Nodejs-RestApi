// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      name: string
      amount: number
      type: string
      createdAt: string
      updatedAt: string
    }
  }
}
