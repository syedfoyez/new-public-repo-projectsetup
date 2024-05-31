const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
    return db
    .query(
        `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;`,
        [article_id]
    )
    .then((result) => {
        const article = result.rows[0];
        if (!article) {
            return Promise.reject({ status: 404, msg: 'Article not found' });
        }
        return article;
    });
};
exports.selectAllArticles = (topic) => {
    let queryStr = `
        SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id`;
        const queryParams = []

        if (topic) {
            queryStr += ` WHERE articles.topic = $1`;
            queryParams.push(topic)
        }

        queryStr += `
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`;

    return db
    .query(queryStr, queryParams)
    .then((result) => {
        return result.rows;
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
    if (typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, msg: 'Bad request' });
    }

    return db
    .query(
        `UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;`,
        [inc_votes, article_id]
    )
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article not found' });
        }
        return result.rows[0];
    });
}