import { test, expect, afterAll, beforeAll, describe, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { transactionDataCredit, transactionDataDebit } from './mock/mockData'
import { execSync } from 'node:child_process'

describe('transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    execSync('npm run migrate:rollback')
    execSync('npm run migrate:latest')
  })

  test('should create a new credit transaction', async () => {
    const response = await request(app.server)
      .post('/transactions/create')
      .send(transactionDataCredit)
    expect(response.status).toBe(201)
  })

  test('should create a new debit transaction', async () => {
    const response = request(app.server)
      .post('/transactions/create')
      .send(transactionDataDebit)
    expect((await response).status).toEqual(201)
  })

  test.todo('should update some transaction', async () => {
    const headerPost = await request(app.server)
      .post('/transactions/create')
      .send(transactionDataCredit)

    const cookie = headerPost.header['set-cookie']

    const transaction = await request(app.server)
      .get('/transactions/list')
      .set('Cookie', cookie)

    const body = transaction.body[0]

    const update = await request(app.server)
      .put(`/transactions/list/${body.id}`)
      .send(transactionDataDebit)

    console.log(`/transactions/list/${body.id}`)
    console.log(body)
    console.log(update.body)
  })

  test('should be abble to list all credit transactions', async () => {
    const response = await request(app.server)
      .post('/transactions/create')
      .send(transactionDataCredit)

    const cookie = response.header['set-cookie'].toString()
    const sessionId = cookie.includes('sessionId') ? cookie : ''
    const transactions = await request(app.server)
      .get('/transactions/list')
      .set('Cookie', sessionId)
      .expect(200)

    expect(transactions.body).toEqual([
      expect.objectContaining(transactionDataCredit),
    ])

    expect(response.status).toEqual(201)
  })

  test('should be abble to list all debit transactions', async () => {
    const response = await request(app.server)
      .post('/transactions/create')
      .send(transactionDataDebit)
      .expect(201)

    const cookie = response.header['set-cookie'].toString()
    const sessionId = cookie.includes('sessionId') ? cookie : ''

    const transaction = await request(app.server)
      .get('/transactions/list')
      .set('Cookie', sessionId)

    transactionDataDebit.amount *= -1

    expect(response.status).toBe(201)
    expect(transaction.body).toEqual([
      expect.objectContaining(transactionDataDebit),
    ])
  })

  test('should be abble list a specific transaction', async () => {
    const response = await request(app.server)
      .post('/transactions/create')
      .send(transactionDataDebit)
      .expect(201)

    const cookie = response.header['set-cookie']

    const transactions = await request(app.server)
      .get('/transactions/list')
      .set('Cookie', cookie)
      .expect(200)

    const bodyId = transactions.body[0].id

    const transactionsById = await request(app.server)
      .get(`/transactions/list/${bodyId}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(transactions.body).toEqual([transactionsById.body])
  })

  afterAll(async () => {
    await app.close()
  })
})
