const { selectCommentsByArticleId } = require('../model/comments.models');

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