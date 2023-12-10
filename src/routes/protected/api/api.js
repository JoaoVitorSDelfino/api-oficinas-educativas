const express = require('express')
const router = express.Router()

router.get('/api', async (req, res) => {
    try {
        res.status(200).json({status: true, mensagem: 'Você está na rota API!'})
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao acessar a rota API'})
    }
})

router.use('/api', require('./operations/operations'))

router.use('/api/oficinas', require('./oficinas'))
router.use('/api/usuarios', require('./usuarios'))
router.use('/api/organizadores', require('./organizadores'))
router.use('/api/participantes', require('./participantes'))

module.exports = router