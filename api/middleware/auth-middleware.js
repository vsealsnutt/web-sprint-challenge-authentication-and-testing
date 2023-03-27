const User = require('../users/users-model');

async function checkUsernameFree(req, res, next) {
    try {
        const users = await User.findById({ username: req.body.username });
        if (!users.length) {
            next();
        } else {
            next({ status: 422, message: 'Username taken' })
        }
    } catch (err) {
        next(err);
    }
}

function checkUsernameExists(req, res, next) {
    if (!req.body.username) {
        res.status(401).json({ message: 'Invalid credentials' })
    } else {
        next();
    }
}

module.exports = {
    checkUsernameFree,
    checkUsernameExists
}