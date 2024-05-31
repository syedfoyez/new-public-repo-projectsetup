const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/articles/:article_id/comments', () => {

    test('200: responds with an array of comment objects for the given article_id, sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.comments;
            
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

describe('POST /articles/:article_id/comments', () => {

    test('201: responds with the posted comment', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'This is a new comment'
        };

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then((response) => {
            const comment = response.body.comment;
            expect(comment).toEqual(
                expect.objectContaining({
                    comment_id: expect.any(Number),
                    article_id: 1,
                    author: 'butter_bridge',
                    body: 'This is a new comment',
                    votes: 0,
                    created_at: expect.any(String)
                })
            )
        })

    })

    test('404: responds with an error message when article is not found', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'This is a new comment'
        };

        return request(app)
        .post('/api/articles/99999/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Article not found');
        });
    })


    test('400: responds with an error message when article_id is invalid', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'This is a new comment'
        }

        return request(app)
        .post('/api/articles/not-a-number/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    })

    test('400: responds with an error message when username', () => {
        const newComment = {
            body: 'This is a new comment'
        };

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });

    test('400: responds with an error message when body is missing', () => {
        const newComment = {
            username: 'butter_bridge'
        };

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    });
})

describe('DELETE /api/comments/:comment_id', () => {
    test('204: responds with no content when comment is deleted', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204);
    })

    test('404: responds with an error message when comment_id is not found', () => {
        return request(app)
        .delete('/api/comments/99999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Comment not found');
        });
    })


    test('400: responds with an error message when comment_id is invalid', () => {
        return request(app)
        .delete('/api/comments/not-a-number')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad request');
        });
    })
})