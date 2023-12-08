const Usuario = require('../models/usuario')
const {validateUsuario} = require('./validate/usuarioValidation')
const validarBuscaLista = require('./controller').validarBuscaLista

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

    // Listar todos os usuários no banco de dados,
    // utilizado apenas para o processamento de dados na
    // lógica de negócio e para nenhuma outra rota
    listar: async () => {
        return await Usuario.findAll()
    },

    listarPaginacao: async (limite, pagina) => {
        limite = parseInt(limite)
        pagina = (pagina - 1) * 5

        if (validarBuscaLista(limite, pagina).status) {
            const usuarios = await Usuario.findAll({offset: pagina, limit: limite})
    
            return {status: true, mensagem: 'Sucesso ao buscar página de usuários!', usuario: usuarios}
        } else {
            return validarBuscaLista(limite, pagina)
        }
    }
}