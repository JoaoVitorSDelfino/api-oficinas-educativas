const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const Usuario = require('../../models/usuario')

router.post('/login', async (req, res) => {
    try {
        const {login, senha} = req.body
        const usuario = await Usuario.findOne({where: 
            { 
                login: login
            } 
        })

        // Verifica se usuário fornecido existe
        if (usuario) {
            // Verifica se a senha está correta
            if (senha == usuario.senha) {
                const token = jwt.sign({id: usuario.id}, 'secret', {expiresIn: '1 hr'})
                res.json({auth: true, mensagem: 'Login bem sucedido!',token: token})
            }
            
            res.json({auth: false, mensagem: 'ERRO, senha incorreta!',token: token})
        } else {
            res.json({auth: false, mensagem: 'ERRO, usuário não existe!',token: token})
        }
    } catch (error) {
        console.log(error)
        res.json({auth: false, mensagem: 'ERRO ao realizador login'})
    }
});

module.exports = router