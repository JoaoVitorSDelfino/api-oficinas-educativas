const express = require('express')
const router = express.Router()

router.get('/operations', async (req, res) => {
    try {
        res.status(200).json({status: true, mensagem: 'Você está na rota para operações!'})
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao acessar a rota de operações'})
    }
})

router.use('/operations/', require('./ranking'))
router.use('/operations/', require('./workedTogether'))

module.exports = router