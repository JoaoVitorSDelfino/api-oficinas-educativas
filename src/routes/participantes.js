const express = require('express')
const router = express.Router()
const Participante = require("../models/participante")
const validation = require('../utils/validation')

// Rota para obter todos os participantes
router.get('/', async (req, res) => {
    const participantes = await Participante.findAll()
    const jsonParticipantes = JSON.stringify({ lista: participantes }, null, 2)

    res.setHeader('Content-Type', 'application/json')
    res.end(jsonParticipantes)
})

// Rota para adicionar participante
router.post('/add', async (req, res) => {
    try {
        // Valida se valores digitados são válidos
        if (validation.validarParticipante(req.body).status) {
            const {idUsuario, idOficina, presente, nota} = req.body 

            const participanteExiste = await Participante.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se participante que deseja criar já existe
            if (!participanteExiste) {
                // Adicionar o participante
                const participante = await Participante.create(req.body)
    
                res.status(201).json({
                    mensagem: 'Participante adicionado com sucesso!',
                    participante: participante,
                })
            } else {
                console.log('ERRO, participante já existe.')
                res.status(400).json({ error: 'ERRO, participante já existe.' })
            }
        } else {
            console.log(validation.validarParticipante(req.body).mensagem)
            res.status(400).json({ error: validation.validarParticipante(req.body).mensagem })
        }
    } catch (error) {
        // Caso algum id informado não exista
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            console.log('ERRO, usuário ou oficina não existe!')
            res.status(400).json({ error: 'ERRO, usuário ou oficina não existe!' })
          } else {
            console.log('ERRO interno do servidor.')
            res.status(500).json({ error: 'ERRO interno do servidor.' })
          }
    }
})

// Pesquisar participante específico pelo id
router.get('/view/:id', async (req, res) => {
    try {
        const participante = await Participante.findOne({
            where: {id: req.params.id}
        })

        // Valida se participante foi encontrado
        if (participante) {
            res.json(participante)
        } else {
            res.status(500).json({error: 'ERRO, participante não existe!'})
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao buscar participante'})
    }
})

module.exports = router