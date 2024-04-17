const { verify } = require('jsonwebtoken');
const { Post } = require('../models');

const validateToken = (req, res, next) => {
    const accessToken = req.header('accessToken');

    if (!accessToken) return res.json({ error: '로그인 상태가 아닙니다.' });

    try {
        const validToken = verify(accessToken, 'importantsecret');
        req.user = validToken
        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.json({ error: err });
    }
};

module.exports = { validateToken };
