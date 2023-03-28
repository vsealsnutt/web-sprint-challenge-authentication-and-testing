const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

const sampleUser = { username: 'alice', password: 'madhatter' }

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
  test('adds a user to the database', async () => {
    await request(server).post('/api/auth/register').send(sampleUser)
    expect(await db('users')).toHaveLength(1)
  })
  test('responds with new user', async () => {
    const res = await request(server).post('/api/auth/register').send(sampleUser)
    expect(res.body.username).toBe(sampleUser.username)
  })
})

describe('[POST] /login', () => {
  test('responds with a welcome message and token on success', async () => {
    await request(server).post('/api/auth/register').send(sampleUser)
    const res = await request(server).post('/api/auth/login').send(sampleUser)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('token')
  })
  test('incorrect username gives an error', async () => {
    await request(server).post('/api/auth/register').send(sampleUser)
    const res = await request(server).post('/api/auth/login').send({ username: 'alic', password: sampleUser.password })
    expect(res.body.message).toBe("invalid credentials")
  })
})

describe('[GET] /jokes', () => {
  test('returns a status 200 when an authorized user logs in', async () => {
    const res = await request(server).post('/api/auth/register').send(sampleUser)
    await request(server).post('/api/auth/login').send(sampleUser)
    await request(server).get('/api/jokes').set('authorization', `${res.body.token}`)
    expect(res.status).toBe(200)
  })
  test('resturns list of jokes when an authorized user logs in', async () => {
    await request(server).post('/api/auth/register').send(sampleUser)
    const res = await request(server).post('/api/auth/login').send(sampleUser)
    const data = await request(server).get('/api/jokes').set('Authorization', `${res.body.token}`)
    expect(data.body).toHaveLength(3)
  })
})