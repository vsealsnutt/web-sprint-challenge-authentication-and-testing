const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

describe('[POST] /register', () => {
  const sampleUser = { username: 'alice', password: 'madhatter' }
  test('adds a user to the database', async () => {
    await request(server).post('/api/auth/register').send(sampleUser)
    expect(await db('users')).toHaveLength(1)
  })
  test('responds with new user', async () => {
    const res = await request(server).post('/api/auth/register').send(sampleUser)
    expect(res.body).toMatchObject(sampleUser)
  })
})

describe('[POST] /login', () => {
  const sampleUser = { username: 'alice', password: 'madhatter' }
  test('responds with a welcome message and token on success', async () => {
    const res = await (await request(server).post('/api/auth/login')).send(sampleUser)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('token')
  })
  test('incorrect username gives an error', async () => {
    await (await request(server).post('/api/auth/login')).send(sampleUser)
    const res = await (await request(server).post('/api/auth/login')).send({ username: 'alic', password: sampleUser.password })
    expect(res.body.message).toBe("invalid credentials")
  })
})