const jwt = require('jsonwebtoken')

// Verifica role do usuário
const verifyAccess = (req, res, next) => {
    const token = req.headers.authorization
    
    jwt.verify(token, 'secret', (err, decoded) => {
        if (decoded.role === 'coordenador') {
            return res.status(403).json({ status: true, role: 'coordenador' })
        } else if (decoded.role === 'professor') {
            return res.status(403).json({ status: true, role: 'professor' })
        } else if (decoded.role === 'usuario') {
            return res.status(403).json({ status: true, role: 'aluno' })
        }
    })
}

module.exports = verifyAccess