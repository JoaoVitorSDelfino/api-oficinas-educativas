const express = require('express')
const router = express.Router()
const Oficina = require("../models/oficina")

// Adicionar nova oficina
router.post('/add', async (req, res) => {
    try {
        let {nome, descricao, data, local} = req.body

        const oficina = await Oficina.create({nome, descricao, data, local})

        res.status(201).json(oficina)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ERRO ao criar oficina.' })
    }
})

module.exports = router