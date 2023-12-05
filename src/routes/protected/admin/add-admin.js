const express = require('express')
const router = express.Router()

const Usuario = require("../../../models/usuario")
const {validateAdmin} = require('../../../controller/validate/usuarioValidation')

router.post('/add-admin', async (req, res) => {
    try {
        // Valida os dados recebidos
        if (validateAdmin(req.body).status) {
            let {nome, senha, email} = req.body

            funcao = 'coordenador'

            const usuario = await Usuario.create({funcao, nome, senha, email})

            res.status(201).json(usuario)
        } else {
            res.status(400).json({error: validateAdmin(req.body).mensagem})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao criar usuario admin.'})
    }
})

module.exports = router