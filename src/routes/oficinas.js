const express = require('express')
const router = express.Router()
const Oficina = require("../models/oficina")

// Adicionar nova oficina
router.post('/add', async (req, res) => {
    try {
        const novaOficina = await Oficina.create(req.body)

        res.status(201).json(novaOficina)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar oficina.' })
    }
})

module.exports = router