const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/articles/:article_id/comments', () => {
    let validArticleId;


    beforeEach(() => {
        return db.query('SELECT article_id FROM articles LIMIT 1;').then(({ rows }) => {
            validArticleId = rows[0].article_id;
        });
    });

    test('200: responds with an array of comment objects for the given article_id, sorted by date in descending order', () => {
        return request(app)
        .get(`/api/articles/${validArticleId}/comments`)
        .expect(200)
        .then((response) => {
            const comments = response.body.comments;
            expect(comments).toBeInstanceOf(Array);
            expect(comments).toHaveLength(testData.commentData.filter(comment => comment.article_id === 1).length);
            expect(comments).toBeSortedBy('created_at', { descending: true });

            comments.forEach((comment) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                    })
                )
            })
        })
    })


    test('404: responds with an error message when article is not found', () => {
        return request(app)
        .get('/api/articles/99999/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article not found');
        });
    });


    test('400: responds with an error message when article_id is invalid', () => {
        return request(app)
        .get('/api/articles/not-a-number/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
})