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

    test('200: responds with an array of articles filtered by topic', () => {
        return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then((response) => {
                const articles = response.body.articles;
                expect(articles).toBeInstanceOf(Array);
                articles.forEach((article) => {
                    expect(article.topic).toBe('mitch');
                });
            });
    });

    test('200: responds with an empty array when no articles match the topic', () => {
        return request(app)
            .get('/api/articles?topic=nonexistent')
            .expect(200)
            .then((response) => {
                expect(response.body.articles).toEqual([]);
            });
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('200: responds with the updated article when votes are incremented', () => {
        const incVotes = { inc_votes: 1 };
        return request(app)
        .patch('/api/articles/1')
        .send(incVotes)
            .expect(200)
            .then((response) => {
                const { article } = response.body;
                expect(article).toEqual(
                    expect.objectContaining({
                        article_id: 1,
                        votes: expect.any(Number)
                    })
                )
                expect(article.votes).toBe(101);
            })
    })

    test('200: responds with the updated article when votes are decremented', () => {
        const incVotes = { inc_votes: -100 };
        return request(app)
        .patch('/api/articles/1')
        .send(incVotes)
        .expect(200)
        .then((response) => {
            const { article } = response.body;
            expect(article).toEqual(
                expect.objectContaining({
                    article_id: 1,
                    votes: expect.any(Number)
                })
            );
            expect(article.votes).toBe(0);
        });
    });


    test('400: responds with an error message when inc_votes is missing', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });

    test('400: responds with an error message when article_id is invalid', () => {
        return request(app)
        .patch('/api/articles/not-a-number')
        .send({ inc_votes: 1 })
        .expect(400)
         .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });

    test('404: responds with an error message when article is not found', () => {
        return request(app)
        .patch('/api/articles/99999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article not found');
        });
    });

    test('400: responds with an error message when inc_votes is not a number', () => {
        const incVotes = { inc_votes: 'not-a-number' };
        return request(app)
        .patch('/api/articles/1')
        .send(incVotes)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
});