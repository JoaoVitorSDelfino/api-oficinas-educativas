const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

router.post('/login', async (req, res) => {
    try {
        const { login, senha } = req.body
        const usuario = await Usuario.findOne({
            where: { login: login }
        })

        if (usuario) {
            if (senha == usuario.senha) {
                const token = jwt.sign({ id: usuario.id }, 'secret', { expiresIn: '1h' })
                res.json({ auth: true, mensagem: 'Login bem sucedido!', token: token })
            } else {
                res.json({ auth: false, mensagem: 'ERRO, senha incorreta!' })
            }
        } else {
            res.json({ auth: false, mensagem: 'ERRO, usuário não existe!' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ auth: false, mensagem: 'ERRO ao realizar login' })
    }
});

module.exports = router