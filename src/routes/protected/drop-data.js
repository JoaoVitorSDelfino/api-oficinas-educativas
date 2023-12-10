const express = require('express')
const router = express.Router()

const Oficina = require('../../models/oficina')
const Usuario = require('../../models/usuario')
const Organizador = require("../../models/organizador")
const Participante = require("../../models/participante")

router.delete('/drop-data', async (req, res) => {
    try {
        await Organizador.destroy({ where: {}})
        await Participante.destroy({ where: {}})
        await Oficina.destroy({ where: {}})
        await Usuario.destroy({ where: {}})

        res.status(201).json({mensagem: 'Sucesso ao deletar banco de dados!'})
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao deletar banco de dados.'})
    }
})

module.exports = router