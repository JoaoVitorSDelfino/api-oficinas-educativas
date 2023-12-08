const express = require('express')
const router = express.Router()

const Participante = require('../../../controller/participanteController')
const Organizador = require('../../../controller/organizadorController')
const Oficina = require('../../../controller/oficinaController')

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyProfessor')
const verifyAdmin = require('../../../middlewares/verifyAdmin')

// Rota para obter lista de participantes
router.get('/list/:limite/:pagina', async (req, res) => {
    try {
        let {limite, pagina} = req.params

        const listaPaginada = await Participante.listarPaginacao(limite, pagina)

        if (listaPaginada.status) {
            res.status(200).json(listaPaginada)
        } else {
            res.status(400).json(listaPaginada)
        }
    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO buscar lista de participantes'})
    }
})

// Rota para adicionar participante
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

        const organizadorExiste = await Organizador.buscarPorIdUsuarioEOficina(idEditor, req.body.idOficina)

        // Apenas professores organizadores ou coordenadores 
        // (não necessariamente organizadores) podem adicionar participantes
        if (organizadorExiste.status || role == 'coordenador') {
            const participante = await Participante.criar(req.body)

            if (participante.status) {
                res.status(201).json(participante)
            } else {
                res.status(400).json(participante)
            }
        } else {
            res.status(400).json({status: false, mensagem: 'ERRO, você não é um organizador desta oficina, logo não pode adicionar participantes!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'ERRO interno do servidor.' })
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

// Alterar um participante pelo id de usuário e oficina
router.put('/edit/:idUsuario/:idOficina', verifyProfessor, async (req, res) => {
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
        
        const oficina = await Oficina.buscarPorId(req.params.idOficina)

        if (!oficina.status) {
            res.status(400).json({status: false, mensagem: 'ERRO, oficina não existe!'})
            return
        }

        const organizadorExiste = await Organizador.buscarPorIdUsuarioEOficina(idEditor, req.params.idOficina)

        // Apenas professores organizadores ou coordenadores 
        // (não necessariamente organizadores) podem editar participantes
        if (organizadorExiste.status || role == 'coordenador') {

            const participanteAtualizado = await Participante.alterarPorIdUsuarioEOficina(req.params.idUsuario, req.params.idOficina, req.body)
        
            if (participanteAtualizado.status) {
                res.status(200).json(participanteAtualizado)
            } else {
                res.status(400).json(participanteAtualizado)
            }
        } else {
            res.status(400).json({status: false, mensagem: 'ERRO, você não é um organizador desta oficina, logo não pode adicionar participantes!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'ERRO ao editar participante.'})
    }
})

// Alterar um participante pelo id do participante
router.put('/editById/:id', verifyProfessor, async (req, res) => {
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

        const oficina = await Oficina.buscarPorId(req.body.idOficina)

        if (!oficina.status) {
            res.status(400).json({status: false, mensagem: 'ERRO, oficina não existe!'})
            return
        }

        const organizadorExiste = await Organizador.buscarPorIdUsuarioEOficina(idEditor, req.body.idOficina)

        // Apenas professores organizadores ou coordenadores 
        // (não necessariamente organizadores) podem editar participantes
        if (organizadorExiste.status || role == 'coordenador') {

            const participanteAtualizado = await Participante.alterar(req.params.id, req.body)
        
            if (participanteAtualizado.status) {
                res.status(200).json(participanteAtualizado)
            } else {
                res.status(400).json(participanteAtualizado)
            }
        } else {
            res.status(400).json({status: false, mensagem: 'ERRO, você não é um organizador desta oficina, logo não pode adicionar participantes!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'ERRO ao editar participante.'})
    }
})

// Deletar um participante pelo id
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

        const oficina = await Oficina.buscarPorId(req.params.idOficina)

        if (!oficina.status) {
            res.status(400).json({status: false, mensagem: 'ERRO, oficina não existe!'})
            return
        }

        const organizadorExiste = await Organizador.buscarPorIdUsuarioEOficina(idEditor, req.params.idOficina)

        // Apenas professores organizadores ou coordenadores 
        // (não necessariamente organizadores) podem editar participantes
        if (organizadorExiste.status || role == 'coordenador') {
            const participanteExcluido = await Participante.deletarPorIdUsuarioEOficina(req.params.idUsuario, req.params.idOficina)

            if (participanteExcluido.status) {
                res.status(200).json(participanteExcluido)
            } else {
                res.status(400).json(participanteExcluido)
            }   
        } else {
            res.status(400).json({status: false, mensagem: 'ERRO, você não é um organizador desta oficina, logo não pode adicionar participantes!'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'ERRO ao deletar participante.'})
    }
})

// Deletar um participante pelo id do participante
router.delete('/deleteById/:id', verifyAdmin, async (req, res) => {
    try {
        const participanteExcluido = await Participante.deletar(req.params.id)

        if (participanteExcluido.status) {
            res.status(200).json(participanteExcluido)
        } else {
            res.status(400).json(participanteExcluido)
        }   
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'ERRO ao deletar participante.'})
    }
})

module.exports = router