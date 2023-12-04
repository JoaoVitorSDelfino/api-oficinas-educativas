const jwt = require('jsonwebtoken')

// Autentifica o token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization

    // Verifica se o token foi informado
    if (token) {
        // Verifica se o token é válido
        jwt.verify(token, 'secret', (err) => {
            if (err) {
                return res.status(401).json({ status: false, error: 'ERRO, token inválido!' })
            }

            next()
        })
    } else {
        return res.status(401).json({ status: false, error: 'ERRO, você não possui um token!' })
    }
}

module.exports = authenticate