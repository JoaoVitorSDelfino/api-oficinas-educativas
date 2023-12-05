const express = require('express')
const router = express.Router()
const Participante = require('../../../controller/participanteController')

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyAdmin')

const validation = require('../../../controller/controller')

// Rota para obter lista de participantes
router.get('/list/:limite/:pagina', async (req, res) => {
    try {
        let {limite, pagina} = req.params

        limite = parseInt(limite)
        pagina = (pagina - 1) * 5

        if (validation.validarBuscaLista(limite, pagina).status) {
            const participantes = await Participante.findAll({offset: pagina, limit: limite})
            const jsonParticipantes = JSON.stringify({lista: participantes}, null, 2)
    
            res.setHeader('Content-Type', 'application/json')
            res.end(jsonParticipantes)
        } else {
            res.status(500).json({error: validation.validarBuscaLista(limite, pagina).mensagem})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO buscar lista de participantes'})
    }
})

// Rota para adicionar participante
router.post('/add', verifyProfessor, async (req, res) => {
    try {
        const participante = await Participante.criar(req.body)

        if (participante.status) {
            res.status(201).json(participante)
        } else {
            res.status(400).json(participante)
        }
    } catch (error) {
        // Caso algum id informado não exista
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            res.status(400).json({ error: 'ERRO, usuário ou oficina não existe!' })
          } else {
            res.status(500).json({ error: 'ERRO interno do servidor.' })
          }
    }
})

// Pesquisar participante específico pelo id
router.get('/view/:id', async (req, res) => {
    try {
        const participante = await Participante.buscarPorId(req.params.id)

        // Valida se participante foi encontrado
        if (participante.status) {
            res.status(201).json(participante)
        } else {
            res.status(400).json(participante)
        }
    } catch (error) {
        res.status(500).json({error: 'ERRO ao buscar participante'})
    }
})

// Alterar um participante pelo id
router.put('/edit/:id', verifyProfessor, async (req, res) => {
    try {
        const participanteAtualizado = await Participante.alterar(req.params.id, req.body)
        
        if (participanteAtualizado.status) {
            res.status(200).json(participanteAtualizado)
        } else {
            res.status(400).json(participanteAtualizado)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ERRO ao editar participante.'})
    }
})

// Deletar um participante pelo id
router.delete('/delete/:id', async (req, res) => {
    try {
        const participanteExcluido = await Participante.deletar(req.params.id)

        if (participanteExcluido.status) {
            res.status(200).json(participanteExcluido)
        } else {
            res.status(400).json(participanteExcluido)
        }   
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao deletar participante.'})
    }
})

module.exports = router