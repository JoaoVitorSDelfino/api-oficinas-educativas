const Usuario = require('../models/usuario')
const {validateUsuario} = require('./validate/usuarioValidation')

module.exports = {
    criar: async (dados) => {
        // Valida os dados recebidos
        if (validateUsuario(dados).status) {
            // Padroniza funcao para ser minúsculo
            dados.funcao = dados.funcao.toLowerCase()

            novoUsuario = await Usuario.create(dados)

            return {status: true, mensagem: 'Sucesso ao criar usuário!', usuario: novoUsuario}
        } else {
            return validateUsuario(dados)
        }
    },

    buscarPorId: async (id) => {
        const usuario = await Usuario.findOne({where: {id: id}})

        if (usuario) {
            return {status: true, mensagem: 'Sucesso ao buscar usuário!', usuario: usuario}
        } else {
            return {status: false, mensagem: 'ERRO, usuario não existe!'}
        }   
    },

    alterar: async (id, novosDados) => {
        const usuario = await Usuario.findOne({where: {id: id}})

        if (!usuario) {
            return {status: false, mensagem: 'ERRO, usuário não existe!'}
        }

        if (validateUsuario(novosDados).status) {
            await usuario.update(
                novosDados, 
                {where: {id: id}}
            )

            usuarioAtualizado = await Usuario.findOne({
                where: {id: id}
            })    

            return {status: true, mensagem: 'Sucesso ao alterar usuário!', usuarioAtualizado: usuarioAtualizado}
        } else {
            return validateUsuario(novosDados)
        }
    },

    deletar: async (id) => {
        const usuario = await Usuario.findOne({
            where: { id: id },
        });

        // Valida se usuário informado existe
        if (usuario) { 
            await Usuario.destroy({where: { id: id }})

            return {status: true, mensagem: 'Sucesso ao deletar usuário!', usuarioExcluido: usuario}
        } else {
            return {status: false, mensagem: 'ERRO, usuário não existe!'}
        }
    },

    listar: async () => {
        return await PostModel.findAll()
    },
}