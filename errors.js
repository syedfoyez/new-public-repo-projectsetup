exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};
  

exports.handlePsqlErrors = (err, req, res, next) => {
    const psqlErrorCodes = ['22P02', '23503', '23505'];
    if (psqlErrorCodes.includes(err.code)) {
        res.status(400).send({ msg: 'Bad request' });
    } else {
        next(err);
    }
};
  
exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' });
};