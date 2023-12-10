const express = require('express')
const router = express.Router()

const Oficina = require('../../../../controller/oficinaController')
const Usuario = require('../../../../controller/usuarioController')
const Participante = require('../../../../controller/participanteController')

// Essa rota cria recebe um usuário, e verifica
// todos os usuários que já participou 
// de uma oficina com ele
router.get('/workedTogether/:idUsuario', async (req, res) => {
    try {
        token = req.headers.authorization

        idUsuarioEscolhido = req.params.idUsuario
        usuarioEscolhido = (await Usuario.buscarPorId(idUsuarioEscolhido)).usuario

        if (!usuarioEscolhido) {
            res.status(201).json({status: false, mensagem: 'ERRO, usuário pesquisado não existe!'})
            return
        }

        // Obtém a lista de todos os participantes
        const dadosParticipantes = await Participante.listar()

        let oficinasParticipadas = [],
            posicao = 0

        // Encontra as oficinas que o usuário informado participou
        for (let i = 0; i < dadosParticipantes.length; i++) {
            if (dadosParticipantes[i].idUsuario == idUsuarioEscolhido) {
                oficinasParticipadas[posicao] = await Oficina.buscarPorId(dadosParticipantes[i].idOficina)

                posicao++
            }
        }

        posicao = 0
        let usuariosExistentes = [],             // Armazena apenas todos os usuários que já participou com o usuário, não possui o contador, utilizado apenas para validação
            usuariosParticipantes = []           // Armazena os mesmos usuários, entretanto adiciona um contador de oficinas

        // Encontra os usuários que participaram da mesma oficina que o usuário informado
        for (let i = 0; i < oficinasParticipadas.length; i++) {
            for (let j = 0; j < dadosParticipantes.length; j++) {
                if (oficinasParticipadas[i].oficina.dataValues.id == dadosParticipantes[j].idOficina && dadosParticipantes[j].idUsuario != idUsuarioEscolhido) {
                    if (!usuariosExistentes.includes((await Usuario.buscarPorId(dadosParticipantes[j].idUsuario)).usuario.nome)) {
                        usuariosExistentes[posicao] = (await Usuario.buscarPorId(dadosParticipantes[j].idUsuario)).usuario.nome

                        posicao++
                    }
                }
            }
        }

        // Cria um JSON para armazenar as informações dos usuários e a quantidade
        // de oficinas que participou com o usuário informado
        for (let i = 0; i < usuariosExistentes.length; i++) {
            usuariosParticipantes[i] = {
                usuario: usuariosExistentes[i],
                oficinasJuntos: 0
            }
        }

        // Conta a quantidade de vezes que os usuários encontrados
        // participaram de uma oficina com o usuário informado
        for (let i = 0; i < oficinasParticipadas.length; i++) {
            for (let j = 0; j < dadosParticipantes.length; j++) {
                // Verifica se o participante possui está na lista de usuáriosExistentes
                if (usuariosExistentes.includes((await Usuario.buscarPorId(dadosParticipantes[j].idUsuario)).usuario.nome)) {
                    // Verifica se o participante está na mesma oficina que alguma das oficinas participadas
                    if (dadosParticipantes[j].idOficina == oficinasParticipadas[i].oficina.dataValues.id) {
                        // Roda o array para incrementar o contador
                        for (let z = 0; z < usuariosParticipantes.length; z++) {
                            if (usuariosParticipantes[z].usuario == (await Usuario.buscarPorId(dadosParticipantes[j].idUsuario)).usuario.nome) {
                                usuariosParticipantes[z].oficinasJuntos += 1

                                z = usuariosParticipantes.length
                            }
                        }
                    }
                }
            }
        }

        if (usuariosParticipantes.length == 0) {
            res.status(201).json({status: true, usuarioPesquisado: usuarioEscolhido.nome, mensagem: 'Sucesso, entretanto esse usuário não participou de oficinas com outros usuários!'})
        } else {
            res.status(201).json({status: true, mensagem: 'Sucesso em obter os dados!', usuarioPesquisado: usuarioEscolhido.nome, usuariosParticipantes: usuariosParticipantes})
        }

    } catch (error) {
        console.error(error)
        res.status(400).json({error: 'ERRO ao acessar a rota de worked together'})
    }
})

module.exports = router