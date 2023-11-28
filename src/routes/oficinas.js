const express = require('express')
const router = express.Router()
const Oficina = require("../models/oficina")

// Listar todas as oficinas cadastradas
router.get('/', async (req, res) => {
    const oficinas = await Oficina.findAll();
    const jsonOficinas = JSON.stringify({ lista: oficinas }, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.end(jsonOficinas);
})

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