const request = require('supertest');
const app = require('../app');
const path = require('path');

describe('GET /api', () => {
    test('200: responds with a JSON object describing all available endpoints', () => {
        const endpoints = require(path.join(__dirname, '..', 'endpoints.json'));
        
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body.endpoints).toEqual(endpoints);
        });
    });
}); 