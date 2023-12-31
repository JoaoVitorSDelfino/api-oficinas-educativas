const express = require('express')
const authenticate = require('../../../middlewares/authenticate')
const verifyAdmin = require('../../../middlewares/verifyAdmin')

const router = express.Router()

// Verifica a validade do token, e verifica se o usuário é um administrador (coordenador)
router.get('/admin', verifyAdmin, (req, res) => {

    res.json({ status: true, message: 'Você está na rota dedicada a administradores!', userId: req.userId })
})

router.use('/admin/', verifyAdmin, require('./add-admin'))

module.exports = router