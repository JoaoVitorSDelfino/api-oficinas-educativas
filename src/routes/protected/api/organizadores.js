const express = require('express')
const router = express.Router()
const Organizador = require('../../../controller/organizadorController')
const Usuario = require('../../../controller/usuarioController')

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyProfessor')
const verifyAdmin = require('../../../middlewares/verifyAdmin')

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
router.post('/add', verifyProfessor, async (req, res) => {
    try {
        token = req.headers.authorization

        // Verifica a role do editor (quem deseja alterar uma oficina)
        const role = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.role
        })
        // Verifica o id do editor
        const idEditor = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.id
        })

        const usuario = await Usuario.buscarPorId(req.body.idUsuario)

        if (usuario.usuario.funcao == 'aluno') {
            res.status(400).json({status: false, mensagem: 'ERRO, um aluno não pode ser organizador!'})
            return
        }

        const organizadorExiste = await Organizador.buscarPorIdUsuarioEOficina(idEditor, req.body.idOficina)

        // Apenas professores organizadores ou coordenadores 
        // (não necessariamente organizadores) podem adicionar outros organizadores
        // para a oficina especificada
        if (organizadorExiste.status || role == 'coordenador') {
            const organizador = await Organizador.criar(req.body)

            if (organizador.status) {
                res.status(201).json(organizador)
            } else {
                res.status(400).json(organizador)
            }
        } else {
            res.status(400).json({status: false, mensagem: 'ERRO, você não é um organizador desta oficina, logo não pode adicionar outros organizadores!'})
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
router.put('/edit/:id', verifyAdmin, async (req, res) => {
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

// Deletar um organizador pelos ids de usuário e oficina
router.delete('/delete/:idUsuario/:idOficina', verifyProfessor, async (req, res) => {
    try {
        token = req.headers.authorization

        // Verifica a role do editor (quem deseja alterar uma oficina)
        const role = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.role
        })
        // Verifica o id do editor
        const idEditor = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.id
        })

        const organizadorExiste = await Organizador.buscarPorIdUsuarioEOficina(idEditor, req.params.idOficina)

        // Apenas professores organizadores ou coordenadores 
        // (não necessariamente organizadores) podem excluir outros organizadores
        // para a oficina especificada
        if (organizadorExiste || role == 'coordenador') {
            const organizadorExcluido = await Organizador.deletarPorIdUsuarioEOficina(req.params.idUsuario, req.params.idOficina)

            if (organizadorExcluido.status) {
                res.status(200).json(organizadorExcluido)
            } else {
                res.status(400).json(organizadorExcluido)
            }
        } else {
            res.status(400).json({status: false, mensagem: 'ERRO, você não é um organizador desta oficina, logo não pode excluir outros organizadores!'})
        } 
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ERRO ao deletar organizador.'})
    }
})

// Deletar um organizador pelo id de organizador
router.delete('/deleteById/:id', verifyAdmin, async (req, res) => {
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