const jwt = require('jsonwebtoken')

// Verifica se usuário é um administrador (coordenador) ou um professor por meio do payload do token
const verifyProfessor = (req, res, next) => {
    const token = req.headers.authorization
    
    jwt.verify(token, 'secret', (err, decoded) => {
        if (decoded.role == 'coordenador' || decoded.role == 'professor') {
            next()
        } else {
            return res.status(403).json({ status: false, error: 'ERRO, você não possui autorização para acessar essa rota!' })
        }
    })
}

module.exports = verifyProfessor