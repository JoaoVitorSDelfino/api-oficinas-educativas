const express = require('express')
const router = express.Router()
const Participante = require("../models/participante")

// Rota para obter todos os participantes
router.get('/', async (req, res) => {
    const participantes = await Participante.findAll()
    const jsonParticipantes = JSON.stringify({ lista: participantes }, null, 2)

    res.setHeader('Content-Type', 'application/json')
    res.end(jsonParticipantes)
})

module.exports = router