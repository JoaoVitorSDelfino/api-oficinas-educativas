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

module.exports = router;