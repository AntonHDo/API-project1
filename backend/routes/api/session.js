const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

// Log in
router.post(
    '/',
    requireAuth, validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.login({ credential, password });

        if (!user) {
            const err = new Error('Login failed');
            // err.statusCode = "401"
            err.message = "Invalid credentials"
            err.status = 401;
            err.title = 'Login failed';
            err.errors = ['The provided credentials were invalid.'];
            return next(err);
        }

        const token = await setTokenCookie(res, user);
        const returnUser = {
            "id": user.id,
            "firstName": user.firstname,
            "lastName": user.lastname,
            "email": user.email,
            "username": user.username,
            "token": token
        }
        return res.json({
            user: returnUser
        });
    }
);



// Log out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);


// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
        const { user } = req;
        if (user) {
            return res.json({
                user: user.toSafeObject()
            });
        } else return res.json({ user: null });
    }
);



module.exports = router;
