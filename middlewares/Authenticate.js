const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "Salt should be long", function (err, decoded) {
        if (err) {
            res.status(500).json({
                msg: -1,
                content: 'Authentication failed'
            });
        } else {
            req.userInfo = { email: decoded.email, userId: decoded.userId };
            next();
        }
    })
}