const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
})

beforeEach(async () => {
  await db.seed.run();
})

describe('[POST] /register', () => {
  test('responds with status 201', async () => {
    const res = await request(server).post('api/auth/register');
    expect(res.status).toBe(201);
  })
  test('adds new user to users table on success', async () => {
    await (await request(server).post('/api/auth/register')).send()
    const user = await db('users').first()
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('password');
  })
})