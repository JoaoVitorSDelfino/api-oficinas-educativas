const jwt = require('jsonwebtoken')

// Verifica se usuário é um administrador (coordenador) por meio do payload do token
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization
    
    jwt.verify(token, 'secret', (err, decoded) => {
        if (decoded.role !== 'coordenador') {
            return res.status(403).json({ status: false, error: 'ERRO, você não possui autorização para acessar essa rota!' })
        }
    
        next()
    })
}

module.exports = verifyAdmin