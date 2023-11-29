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

// Adicionar novo usuário
router.post('/add', async (req, res) => {
    try {
        // Valida os dados recebidos
        if (validation.validarUsuario(req.body).status) {
            let {funcao, nome, senha, email} = req.body;
            // Padroniza funcao para ser minúsculo
            funcao = funcao.toLowerCase()

            const usuario = await Usuario.create({funcao, nome, senha, email});

            res.status(201).json(usuario)
        } else {
            res.status(400).json({error: validation.validarUsuario(req.body).mensagem})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao criar usuario.'})
    }
})

// Pesquisar usuário específico pelo id
router.get('/view/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            where: {id: req.params.id}
        })

        // Valida se usuário foi encontrado
        if (usuario) {
            res.json(usuario)
        } else {
            res.status(500).json({error: 'ERRO, usuario não existe!'})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao buscar usuário'})
    }
})

// Alterar um usário pelo id
router.put('/edit/:id', async (req, res) => {
    try {
        usuario = await Usuario.findOne({
            where: {id: req.params.id}
        })

        // Valida se a usuário informada existe
        if (usuario) {
            // Valida se os novos dados são válidos
            if (validation.validarUsuario(req.body).status) {
                await usuario.update(
                    req.body, 
                    {where: {id: req.params.id}}
                )

                usuarioAtualizada = await Usuario.findOne({
                    where: {id: req.params.id}
                })    

                res.json({status: 'Usuário alterado com sucesso!', usuarioAtualizada})
            } else {
                res.status(400).json({error: validation.validarUsuario(req.body).mensagem})
            }
        } else {
            res.status(500).json({error: 'ERRO, usuario não existe!'})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao editar usuario.'})
    }
})

module.exports = router;