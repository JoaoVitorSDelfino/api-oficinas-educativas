const express = require('express')
const router = express.Router()
const Organizador = require('../../../controller/organizadorController')

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyAdmin')

const validation = require('../../../controller/controller')

// Rota para obter lista de organizadores
router.get('/list/:limite/:pagina', async (req, res) => {
    try {
        let {limite, pagina} = req.params

        limite = parseInt(limite)
        pagina = (pagina - 1) * 5

        if (validation.validarBuscaLista(limite, pagina).status) {
            const organizadores = await Organizador.findAll({offset: pagina, limit: limite})
            const jsonOrganizadores = JSON.stringify({lista: organizadores}, null, 2)
    
            res.setHeader('Content-Type', 'application/json')
            res.end(jsonOrganizadores)
        } else {
            res.status(500).json({error: validation.validarBuscaLista(limite, pagina).mensagem})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO buscar lista de organizadores'})
    }
})

// Rota para adicionar organizador
router.post('/add', async (req, res) => {
    try {
        const organizador = await Organizador.criar(req.body)

        if (organizador.status) {
            res.status(201).json(organizador)
        } else {
            res.status(400).json(organizador)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'ERRO interno do servidor.' })
    }
})

// Pesquisar organizador específico pelo id
router.get('/view/:id', async (req, res) => {
    try {
        const organizador = await Organizador.buscarPorId(req.params.id)

        // Valida se organizador foi encontrado
        if (organizador.status) {
            res.status(201).json(organizador)
        } else {
            res.status(400).json(organizador)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ERRO ao buscar organizador'})
    }
})

// Alterar um organizador pelo id
router.put('/edit/:id', async (req, res) => {
    try {
        const organizadorAtualizado = await Organizador.alterar(req.params.id, req.body)
        
        if (organizadorAtualizado.status) {
            res.status(200).json(organizadorAtualizado)
        } else {
            res.status(400).json(organizadorAtualizado)
        }
    } catch (error) {
        res.status(500).json({error: 'ERRO ao editar organizador.'})
    }
})

// Deletar um organizador pelo id
router.delete('/delete/:id', async (req, res) => {
    try {
        const organizadorExcluido = await Organizador.deletar(req.params.id)

        if (organizadorExcluido.status) {
            res.status(200).json(organizadorExcluido)
        } else {
            res.status(400).json(organizadorExcluido)
        } 
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ERRO ao deletar organizador.'})
    }
})

module.exports = router