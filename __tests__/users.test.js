const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/users', () => {
    test('200: responds with an array of user objects, each containing username, name, and avatar_url', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            const {users} = response.body;
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(testData.userData.length)
            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    })
                );
            });
        });
    })
})