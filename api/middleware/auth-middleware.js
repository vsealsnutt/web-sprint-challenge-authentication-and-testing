const User = require('../users/users-model');

async function checkUsernameFree(req, res, next) {
    try {
        const user = await User.findById({ username: req.body.username });
        if (!user) {
            next();
        } else {
            next({ status: 422, message: "username taken" })
        }
    } catch (err) {
        next(err);
    }
}

function checkUsernameExists(req, res, next) {
    if (!req.body.username) {
        res.status(401).json({ message: "invalid credentials" })
    } else {
        next();
    }
}

function checkBody(req, res, next) {
    const { username, password } = req.body;
    if (!username || !password || !username.trim() || !password.trim()) {
        next({ message: "username and password required" });
    } else {
        next();
    }
}

module.exports = {
    checkUsernameFree,
    checkUsernameExists,
    checkBody
}