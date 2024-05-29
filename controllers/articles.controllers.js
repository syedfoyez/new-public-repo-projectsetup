const { selectArticleById } = require('../model/articles.models');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then((article) => {
        if (!article) {
            return res.status(404).send({ msg: 'Article not found' })
        }
        res.status(200).send({ article })
    })
    .catch(next)
}

