const express = require('express')
const router = express.Router()

const dados = require("../data/dadosIniciais")

const Oficina = require('../models/oficina')
const Usuario = require('../models/usuario')
const Organizador = require("../models/organizador")
const Participante = require("../models/participante")

router.get('/install', async (req, res) => {
    try {
        await Oficina.sync({ force: true })
        await Usuario.sync({ force: true })
        await Organizador.sync({ force: true })
        await Participante.sync({ force: true })

        for (let i = 0; i < dados.oficinas.length; i++) {
            Oficina.create(dados.oficinas[i])
        }

        for (i = 0; i < dados.usuarios.length; i++) {
             Usuario.create(dados.usuarios[i])
        }

        for (i = 0; i < dados.organizadores.length; i++) {
             Organizador.create(dados.organizadores[i])
        }

        for (i = 0; i < dados.participantes.length; i++) {
             Participante.create(dados.participantes[i])
        }

        res.status(201).json({mensagem: 'Sucesso ao instalar dados inicias!'})
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao instalar dados inciais.'})
    }
})

module.exports = router