const { selectAllUsers } = require('../model/users.models');

exports.getUsers = (req, res, next) => {
    selectAllUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch(next);
};