const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeAll(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test("response with the status of 200 and an array of topics object", () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.map((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String),
                });
            });
        });
    });
    test('404: responds with an error message when route is not found', async () => {
        const { body } = await request(app).get('/api/not-a-route').expect(404);
        expect(body.msg).toBe('Route not found');
    });
});





