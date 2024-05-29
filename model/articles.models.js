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
exports.selectAllArticles = () => {
    return db
    .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then((result) => {
        return result.rows;
    });
};