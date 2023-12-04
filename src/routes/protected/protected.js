const express = require('express')
const authenticate = require('../../middlewares/authenticate')

const router = express.Router()

// Rota protegida
router.get('/protected', authenticate, (req, res) => {
  
    res.json({ status: true, message: 'Rota protegida com sucesso!', userId: req.userId })
})

router.use('/protected', authenticate)
router.use('/protected/', require('./api/api'))
router.use('/protected/', require('./admin/admin'))

router.use('/protected/', require('./install'))
router.use('/protected/', require('./drop-data'))

module.exports = router