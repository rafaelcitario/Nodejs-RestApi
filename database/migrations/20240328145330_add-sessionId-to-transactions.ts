import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('transactions', (table) => {
    table.uuid('sessionId').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('transactions', (table) => {
    table.dropColumns('sessionId')
  })
}
