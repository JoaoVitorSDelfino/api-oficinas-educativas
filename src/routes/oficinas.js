const express = require('express')
const router = express.Router()
const Oficina = require('../models/oficina')
const validation = require('../utils/validation')

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
        // Valida os dados recebidos
        if (validation.validarOficina(req.body).status) {
            const oficina = await Oficina.create(req.body)

            res.status(201).json(oficina)
        } else {
            res.status(400).json({error: validation.validarOficina(req.body).mensagem})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao criar oficina.'})
    }
})

// Pesquisar oficina específica pelo id
router.get('/view/:id', async (req, res) => {
    try {
        const oficina = await Oficina.findOne({
            where: {id: req.params.id}
        })

        // Valida se oficina foi encontrada
        if (oficina) {
            res.json(oficina)
        } else {
            res.status(500).json({error: 'ERRO, oficina não existe!'})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao buscar oficina'})
    }
})

// Alterar uma oficina pelo id
router.put('/edit/:id', async (req, res) => {
    try {
        oficina = await Oficina.findOne({
            where: {id: req.params.id}
        })

        // Valida se a oficina informada existe
        if (oficina) {
            // Valida se os novos dados são válidos
            if (validation.validarOficina(req.body).status) {
                await Oficina.update(
                    req.body, 
                    {where: {id: req.params.id}}
                )

                oficinaAtualizada = await Oficina.findOne({
                    where: {id: req.params.id}
                })    

                res.json({status: 'Oficina alterada com sucesso!', oficinaAtualizada})
            } else {
                res.status(400).json({error: validation.validarOficina(req.body).mensagem})
            }
        } else {
            res.status(500).json({error: 'ERRO, oficina não existe!'})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao editar oficina.'})
    }
})

// Excluir uma oficina pelo id
router.delete('/delete/:id', async (req, res) => {
    const oficina = await Oficina.findOne({
        where: { id: req.params.id },
    });

    await Oficina.destroy({
        where: { id: req.params.id },
    });

    res.json({status: 'Oficina alterada com sucesso!', oficinaExcluida: oficina});
})

module.exports = router