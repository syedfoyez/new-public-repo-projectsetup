const { selectArticleById, selectAllArticles, updateArticleVotes } = require('../model/articles.models');

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
};

exports.getArticles = (req, res, next) => {
    selectAllArticles().then((articles) => {
        res.status(200).send({ articles})
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
        res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
}