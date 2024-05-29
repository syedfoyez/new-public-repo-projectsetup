const path = require('path');

exports.getApi = (req, res, next) => {
    const endpoints = require(path.join(__dirname, '..', 'endpoints.json'));
    res.status(200).send({ endpoints });
}; 