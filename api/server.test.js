const db = require('../data/dbConfig');
const request = require('supertest');
const authRouter = require('./auth/auth-router');

// Write your tests here
test('sanity', () => {
  expect(true).toBe(false)
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
    const res = await request(authRouter).post('/register');
    expect(res.status).toBe(201);
  })
})