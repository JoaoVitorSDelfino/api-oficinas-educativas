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

// Pesquisar oficina específica pelo id
router.get('/view/:id', async (req, res) => {
    const oficina = await Oficina.findOne({
                        where: {id: req.params.id}
                    })
    
    res.json(oficina)
})

// Alterar uma oficina pelo id
router.put("/edit/:id", async (req, res) => {
    const linhasAtualizadas = await Oficina.update(
                                    req.body, 
                                    {where: {id: req.params.id}}
                                    )

    if (linhasAtualizadas > 0) {
        oficinaAtualizada = await Oficina.findOne({
            where: {id: req.params.id}
        })

        res.json({status: 'Oficina alterada com sucesso!', oficinaAtualizada})
    }
})

module.exports = router