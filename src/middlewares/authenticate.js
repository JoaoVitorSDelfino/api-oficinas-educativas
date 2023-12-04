const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization

    if (token) {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'ERRO, token inválido' })
            }

            req.userId = decoded.userId
            next()
        })
    } else {
        return res.status(401).json({ error: 'ERRO, você não possui um token!' })
    }
}

module.exports = authenticate