const express = require('express');
const router = express.Router();
const Usuario = require("../models/usuario");
const validation = require('../utils/validation')

// Listar todos os usuários cadastrados
router.get('/', async (req, res) => {
    const usuarios = await Usuario.findAll();
    const jsonUsuarios = JSON.stringify({ lista: usuarios }, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.end(jsonUsuarios);
})

module.exports = router;