const express = require('express')
const authenticate = require('../../middlewares/authenticate')

const router = express.Router()

// Rota protegida
router.get('/protected', authenticate, (req, res) => {
    try {
        res.status(200).json({ status: true, message: 'Você está na rota protected!' })
    } catch (error) {
        console.error(error)
        res.json({ status: false, message: 'ERRO ao acessar rota protected!' })
    }
})

router.use('/protected', authenticate)
router.use('/protected/', require('./api/api'))
router.use('/protected/', require('./admin/admin'))

router.use('/protected/', require('./drop-data'))

module.exports = router