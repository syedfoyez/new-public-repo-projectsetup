const { selectCommentsByArticleId, insertCommentByArticleId } = require('../model/comments.models');

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    selectCommentsByArticleId(article_id)
    .then((comments) => {
        if (comments.length === 0) {
            return res.status(404).send({ msg: 'Article not found' });
        }
        res.status(200).send({ comments });
    })
    .catch(next);
};

exports.addCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (!username || !body) {
        return res.status(400).send({ msg: 'Bad request' });
    }
  
    insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch((err) => {
        if (err.code === '23503') {
            return res.status(404).send({ msg: 'Article not found' });
        }
        next(err);
    });
};