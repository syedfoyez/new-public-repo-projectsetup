const express = require('express');
const app = express();
const { getApi } = require('./controllers/api.controllers')
const { getTopics } = require('./controllers/topics.controllers');
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors');

app.use(express.json());

app.get('/api', getApi)
app.get('/api/topics', getTopics);

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;