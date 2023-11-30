const express = require('express')
const router = express.Router()
const Participante = require("../models/participante")
const validation = require('../utils/validation')

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

// Alterar um participante pelo id
router.put('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
        
        participante = await Participante.findOne({
            where: {id: id}
        })

        // Valida se valores digitados são válidos
        if (validation.validarParticipante(req.body).status) {
            const {idUsuario, idOficina} = req.body 

            const participanteExiste = await Participante.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se participante que deseja editar já existe
            // Se o participante a ser editado já existe, mas possui
            // mesmo id que o parâmetro, então o participante pode ser editado
            if (!participanteExiste || (participanteExiste && participanteExiste.id == id)) {
                await Participante.update(
                    req.body, 
                    {where: {id: id}}
                )

                participanteAtualizado = await Participante.findOne({
                    where: {id: id}
                })

                res.json({status: 'Participante alterado com sucesso!', participanteAtualizado})
            } else {
                console.log('ERRO, participante já existe.')
                res.status(400).json({ error: 'ERRO, participante já existe.' })
            }
        } else {
            res.status(500).json({error: validation.validarParticipante(req.body).mensagem})
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao editar participante.'})
    }
})

// Deletar um participante pelo id
router.delete('/delete/:id', async (req, res) => {
    try {
        const participante = await Participante.findOne({
            where: { id: req.params.id },
        })

        // Valida se participante informado existe
        if (participante) { 
            await Participante.destroy({
                where: { id: req.params.id },
            })
        
            res.json({status: 'Participante deletado com sucesso!', participanteExcluido: participante})
        } else {
            res.status(500).json({error: 'ERRO, participante não existe!'})
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao deletar participante.'})
    }
})

module.exports = router