const express = require('express')
const router = express.Router()
const Usuario = require("../../../models/usuario")

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyAdmin')

const validation = require('../../../controller/controller')
const {validateUsuario} = require('../../../controller/usuarioController')
const validarUsuario = validateUsuario

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
        res.status(400).json({error: 'ERRO buscar lista de usuarios'})
    }
})

// Adicionar novo usuário
router.post('/add', verifyProfessor, async (req, res) => {
    try {
        // Valida os dados recebidos
        if (validarUsuario(req.body).status) {
            let {funcao, nome, senha, email} = req.body;
            // Padroniza funcao para ser minúsculo
            funcao = funcao.toLowerCase()

            const usuario = await Usuario.create({funcao, nome, senha, email});

            res.status(201).json(usuario)
        } else {
            res.status(400).json({error: validarUsuario(req.body).mensagem})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao criar usuario.'})
    }
})

// Pesquisar usuário específico pelo id
router.get('/view/:id', verifyProfessor, async (req, res) => {
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

// Alterar um usuário pelo id
router.put('/edit/:id', async (req, res) => {
    try {
        token = req.headers.authorization

        // Verifica a role do usuário
        // Se for um professor, pode alterar a si mesmo e alunos
        // Se for um usuário, pode alterar apenas a si mesmo
        role = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.role
        })

        usuario = await Usuario.findOne({
            where: {id: req.params.id}
        })

        if (role == 'aluno') {
            idAluno = jwt.verify(token, 'secret', (err, decoded) => {
                            return decoded.id
                      })
            if (!usuario) {
                res.status(500).json({error: 'ERRO, usuario não existe!'})
            }

            if (idAluno == usuario.id) {
                if (validarUsuario(req.body).status) {
                    await usuario.update(
                        req.body, 
                        {where: {id: req.params.id}}
                    )
    
                    usuarioAtualizado = await Usuario.findOne({
                        where: {id: req.params.id}
                    })    
    
                    res.json({status: 'Usuário alterado com sucesso!', usuarioAtualizado})
                } else {
                    res.status(400).json({error: validarUsuario(req.body).mensagem})
                }
            } else {
                res.status(500).json({error: 'ERRO, você não possui permissão para alterar informação de outros usuários!'})
            }
        }

        if (!usuario) {
            res.status(500).json({error: 'ERRO, usuario não existe!'})
        }

        if (role == 'professor') {
            idProfessor = jwt.verify(token, 'secret', (err, decoded) => {
                            return decoded.id
                      })
            if (!usuario) {
                res.status(500).json({error: 'ERRO, usuario não existe!'})
            }

            if (idProfessor == usuario.id || usuario.funcao == 'aluno') {
                if (validarUsuario(req.body).status) {
                    await usuario.update(
                        req.body, 
                        {where: {id: req.params.id}}
                    )
    
                    usuarioAtualizado = await Usuario.findOne({
                        where: {id: req.params.id}
                    })    
    
                    res.json({status: 'Usuário alterado com sucesso!', usuarioAtualizado})
                } else {
                    res.status(400).json({error: validarUsuario(req.body).mensagem})
                }
            } else {
                res.status(500).json({error: 'ERRO, você não possui permissão para alterar as informações de coordenadores e outros professores além de você!'})
            }
        }

        if (role == 'coordenador') {
            if (!usuario) {
                res.status(500).json({error: 'ERRO, usuario não existe!'})
            }

            if (validarUsuario(req.body).status) {
                await usuario.update(
                    req.body, 
                    {where: {id: req.params.id}}
                )

                usuarioAtualizado = await Usuario.findOne({
                    where: {id: req.params.id}
                })    

                res.json({status: 'Usuário alterado com sucesso!', usuarioAtualizado})
            } else {
                res.status(400).json({error: validarUsuario(req.body).mensagem})
            }
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao editar usuario.'})
    }
})

// Deletar um usuário pelo id
router.delete('/delete/:id', verifyProfessor, async (req, res) => {
    try {
        const usuario = await Usuario.findOne({
            where: { id: req.params.id },
        });

        // Valida se usuário informado existe
        if (usuario) { 
            await Usuario.destroy({
                where: { id: req.params.id },
            });
        
            res.json({status: 'Usuário deletado com sucesso!', usuarioExcluido: usuario});
        } else {
            res.status(500).json({error: 'ERRO, usuario não existe!'})
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({error: 'ERRO ao deletar usuario.'})
    }
})

module.exports = router;