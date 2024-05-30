const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('GET /api/articles/:article_id', () => {
    test('200: responds with an article object', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            expect(response.body.article).toEqual(
                expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                })
            );
        });
    });
  
    test('404: responds with an error message when article is not found', () => {
        return request(app)
        .get('/api/articles/99999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article not found');
        });
    });
  
    test('400: responds with an error message when article_id is invalid', () => {
        return request(app)
        .get('/api/articles/not-a-number')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
});

describe('GET /api/articles', () => {
    test('200: responds with an array of article objects, each containing author, title, article_id, topic, created_at, votes, article_img_url, comment_count and the response is sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;
            expect(articles).toBeInstanceOf(Array);
            expect(articles).toHaveLength(testData.articleData.length);

            expect(articles).toBeSortedBy('created_at', { descending: true });


            articles.forEach((article) => {
                expect(article).toEqual(
                    expect.objectContaining({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(String),
                    })
                );

                expect(article).not.toHaveProperty('body');
            });
        });
    });
});