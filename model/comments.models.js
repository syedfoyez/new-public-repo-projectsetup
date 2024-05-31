const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id) => {
    return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id
       FROM comments
       WHERE article_id = $1
       ORDER BY created_at DESC;`,
       [article_id]
    )
    .then((result) => {
        return result.rows;
    });
};

exports.insertCommentByArticleId = (article_id, username, body) => {
    return db
    .query(
        `INSERT INTO comments (article_id, author, body, votes, created_at)
        VALUES ($1, $2, $3, 0, NOW())
        RETURNING *;`,
        [article_id, username, body]
    )
    .then((result) => {
    return result.rows[0];
    });
};

exports.deleteCommentById = (comment_id) => {
    return db.query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
        [comment_id]
    ).then((result) => {
        if (result.rowCount === 0) {
            throw { status: 404, msg: 'Comment not found' };
        }
    });
};
