// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors
            .array()
            .map((error) => `${error.msg}`);

        const err = Error('Validation error.');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad request.';
        next(err);
    }
    next();
};

const convertDate = (date) => {
    const splitDate = date.split('-')
    const miliSec = new Date(splitDate[0], splitDate[1], splitDate[2]).getTime()
    return miliSec
}

module.exports = {
    handleValidationErrors, convertDate
};
