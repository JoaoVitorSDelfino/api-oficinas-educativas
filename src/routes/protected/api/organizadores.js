const express = require('express')
const router = express.Router()
const Organizador = require("../../../models/organizador")

const validation = require('../../../controller/controller')
const validarOrganizador = require('../../../controller/organizadorController')

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
        // Valida se valores digitados são válidos
        if (validarOrganizador(req.body).status) {
            const {idUsuario, idOficina} = req.body 

            const organizadorExiste = await Organizador.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se organizador que deseja criar já existe
            if (!organizadorExiste) {
                // Adicionar o organizador
                const organizador = await Organizador.create(req.body)
    
                res.status(201).json({
                    mensagem: 'Organizador adicionado com sucesso!',
                    organizador: organizador,
                })
            } else {
                console.log('ERRO, organizador já existe.')
                res.status(400).json({ error: 'ERRO, organizador já existe.' })
            }
        } else {
            console.log(validarOrganizador(req.body).mensagem)
            res.status(400).json({ error: validarOrganizador(req.body).mensagem })
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

// Pesquisar organizador específico pelo id
router.get('/view/:id', async (req, res) => {
    try {
        const organizador = await Organizador.findOne({
            where: {id: req.params.id}
        })

        // Valida se organizador foi encontrado
        if (organizador) {
            res.json(organizador)
        } else {
            res.status(500).json({error: 'ERRO, organizador não existe!'})
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao buscar organizador'})
    }
})

// Alterar um organizador pelo id
router.put('/edit/:id', async (req, res) => {
    try {
        organizador = await Organizador.findOne({
            where: {id: req.params.id}
        })

        // Valida se valores digitados são válidos
        if (validarOrganizador(req.body).status) {
            const {idUsuario, idOficina} = req.body 

            const organizadorExiste = await Organizador.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se organizador que deseja editar já existe
            if (!organizadorExiste) {
                await Organizador.update(
                    req.body, 
                    {where: {id: req.params.id}}
                )

                organizadorAtualizado = await Organizador.findOne({
                    where: {id: req.params.id}
                })

                res.json({status: 'Organizador alterado com sucesso!', organizadorAtualizado})
            } else {
                console.log('ERRO, organizador já existe.')
                res.status(400).json({ error: 'ERRO, organizador já existe.' })
            }
        } else {
            res.status(500).json({error: 'ERRO, organizador não existe!'})
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao editar organizador.'})
    }
})

// Deletar um organizador pelo id
router.delete('/delete/:id', async (req, res) => {
    try {
        const organizador = await Organizador.findOne({
            where: { id: req.params.id },
        })

        // Valida se organizador informado existe
        if (organizador) { 
            await Organizador.destroy({
                where: { id: req.params.id },
            })
        
            res.json({status: 'Organizador deletado com sucesso!', organizadorExcluido: organizador})
        } else {
            res.status(500).json({error: 'ERRO, organizador não existe!'})
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao deletar organizador.'})
    }
})

module.exports = router