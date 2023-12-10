const express = require('express')
const router = express.Router()
const Usuario = require('../../../controller/usuarioController')

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyProfessor')
const verifyAdmin = require('../../../middlewares/verifyAdmin')

// Rota para obter lista de usuários
router.get('/list/:limite/:pagina', verifyProfessor, async (req, res) => {
    try {
        let {limite, pagina} = req.params

        const listaPaginada = await Usuario.listarPaginacao(limite, pagina)

        if (listaPaginada.status) {
            res.status(200).json(listaPaginada)
        } else {
            res.status(400).json(listaPaginada)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ERRO buscar lista de usuários'})
    }
})

// Adicionar novo usuário (professor ou aluno)
router.post('/add', verifyProfessor, async (req, res) => {
    try {
        const usuario = await Usuario.criar(req.body)

        if (usuario.status) {
            res.status(201).json(usuario)
        } else {
            res.status(400).json(usuario)
        }
    } catch (error) {
        console.error(error)
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
        console.error(error)
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

        dados = req.body

        if (role == 'aluno') {
            if (idEditor != req.params.id) {
                res.status(403).json({error: 'ERRO, você não possui permissão para alterar informação de outros usuários!'})
                return
            } else if (dados.funcao && dados.funcao != 'aluno') {
                res.status(403).json({error: 'ERRO, você não possui permissão para alterar sua função!'})
                return
            }
        }

        funcao = (await Usuario.buscarPorId(req.params.id)).usuario.funcao
        
        // Verifica se o id digitado é o mesmo do professor e se ele tentou ajustar a função do usuário 
        if (role == 'professor') {
            if (idEditor != req.params.id && funcao != 'aluno') {
                res.status(403).json({error: 'ERRO, você não possui permissão para alterar as informações de coordenadores e outros professores além de você!'})
                return
            } else if (dados.funcao && dados.funcao != funcao) {
                res.status(403).json({error: 'ERRO, você não possui permissão para alterar funções de usuários!'})
                return
            }
        }

        // Se a função não for informada, então ela não é alterada
        if (!dados.funcao) {
            dados.funcao = funcao
        }

        const usuarioAtualizado = await Usuario.alterar(req.params.id, dados)

        if (usuarioAtualizado.status) {
            res.status(200).json(usuarioAtualizado)
        } else {
            res.status(400).json(usuarioAtualizado)
        }
        return
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ERRO ao editar usuário'})
    }
})

// Deletar um usuário pelo id
// Apenas administradores (coordenadores) podem remover usuários
router.delete('/delete/:id', verifyAdmin, async (req, res) => {
    try {
        const usuarioExcluido = await Usuario.deletar(req.params.id)

        if (usuarioExcluido.status) {
            res.status(200).json(usuarioExcluido)
        } else {
            res.status(400).json(usuarioExcluido)
        }   
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ERRO ao deletar usuario.'})
    }
})

module.exports = router