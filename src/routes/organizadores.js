const express = require('express');
const router = express.Router();
const Organizador = require("../models/organizador");
const validation = require('../utils/validation');

// Rota para obter todos os organizadores
router.get('/', async (req, res) => {
    const organizadores = await Organizador.findAll();
    const jsonOrganizadores = JSON.stringify({ lista: organizadores }, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.end(jsonOrganizadores);
});

router.post('/add', async (req, res) => {
    try {
        if (!validation.validarOrganizador(req.body)) {
            // Adicionar o organizador
            const organizador = await Organizador.create(req.body)
  
            res.status(201).json({
                mensagem: 'Organizador adicionado com sucesso!',
                organizador: organizador,
            })
        } else {
            console.log('ERRO, organizador já existe!')
            res.status(400).json({ error: 'ERRO, organizador já existe!' })
        }
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            console.log('ERRO, usuário ou oficina não existe!')
            res.status(400).json({ error: 'ERRO, usuário ou oficina não existe!' })
          } else {
            console.log('ERRO interno do servidor.')
            res.status(500).json({ error: 'ERRO interno do servidor.' })
          }
    }
});

module.exports = router;