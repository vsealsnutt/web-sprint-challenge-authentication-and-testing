const User = require('../users/users-model');

async function checkUsernameFree(req, res, next) {
    try {
        const [user] = await User.findBy({ username: req.body.username });
        if (!user) {
            next();
        } else {
            return res.status(422).json({ message: "username taken" })
        }
    } catch (err) {
       return res.status(422).json({ message: "username taken" });
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
        res.status(400).json({ message: "username and password required" });
    } else {
        next();
    }
}

module.exports = {
    checkUsernameFree,
    checkUsernameExists,
    checkBody
}