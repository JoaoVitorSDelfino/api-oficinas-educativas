const express = require('express')
const router = express.Router()
const Usuario = require('../../../controller/usuarioController')

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyAdmin')

const validation = require('../../../controller/controller')

// Rota para obter lista de usuários
router.get('/list/:limite/:pagina', verifyProfessor, async (req, res) => {
    try {
        let {limite, pagina} = req.params

        limite = parseInt(limite)
        pagina = (pagina - 1) * 5

        if (validation.validarBuscaLista(limite, pagina).status) {
            const usuarios = await Usuario.findAll({offset: pagina, limit: limite})
            const jsonUsuarios = JSON.stringify({lista: usuarios}, null, 2)
    
            res.setHeader('Content-Type', 'application/json')
            res.end(jsonUsuarios)
        } else {
            res.status(500).json({error: validation.validarBuscaLista(limite, pagina).mensagem})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO buscar lista de usuarios'})
    }
})

// Adicionar novo usuário
router.post('/add', verifyProfessor, async (req, res) => {
    try {
        const usuario = await Usuario.criar(req.body)

        if (usuario.status) {
            res.status(201).json(usuario)
        } else {
            res.status(400).json(usuario)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao criar usuario.'})
    }
})

// Pesquisar usuário específico pelo id
router.get('/view/:id', verifyProfessor, async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorId(req.params.id)

        // Valida se usuário foi encontrado
        if (usuario.status) {
            res.status(201).json(usuario)
        } else {
            res.status(400).json(usuario)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao buscar usuário'})
    }
})

// Alterar um usuário pelo id
router.put('/edit/:id', async (req, res) => {
    try {
        token = req.headers.authorization

        // Verifica a role do usuário
        // Se for um professor, pode alterar a si mesmo e alunos
        // Se for um usuário, pode alterar apenas a si mesmo
        const role = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.role
        })
        // Verifica o id do editor (quem deseja editar um usuário)
        const idEditor = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.id
        })

        if (role == 'aluno') {
            if (idEditor != req.params.id) {
                res.status(403).json({error: 'ERRO, você não possui permissão para alterar informação de outros usuários!'})
                return
            }
        }

        if (role == 'professor') {
            if (idEditor != req.params.id || req.body.funcao != 'aluno') {
                res.status(403).json({error: 'ERRO, você não possui permissão para alterar as informações de coordenadores e outros professores além de você!'})
                return
            }
        }
        const usuarioAtualizado = await Usuario.alterar(req.params.id, req.body)

        if (usuarioAtualizado.status) {
            res.status(200).json(usuarioAtualizado)
        } else {
            res.status(400).json(usuarioAtualizado)
        }
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao editar usuário'})
    }
})

// Deletar um usuário pelo id
router.delete('/delete/:id', verifyProfessor, async (req, res) => {
    try {
        const usuarioExcluido = await Usuario.deletar(req.params.id)

        if (usuarioExcluido.status) {
            res.status(200).json(usuarioExcluido)
        } else {
            res.status(400).json(usuarioExcluido)
        }   
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao deletar usuario.'})
    }
})

module.exports = router;