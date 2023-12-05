const Oficina = require('../models/oficina')
const {validateOficina} = require('./validate/oficinaValidation')

module.exports = {
    criar: async (dados) => {
        // Valida os dados recebidos
        if (validateOficina(dados).status) {
            const novaOficina = await Oficina.create(dados)

            return {status: true, mensagem: 'Sucesso ao criar oficina!', oficina: novaOficina}
        } else {
            return validateOficina(dados)
        }
    },

    buscarPorId: async (id) => {
        const oficina = await Oficina.findOne({where: {id: id}})

        if (oficina) {
            return {status: true, mensagem: 'Sucesso ao buscar oficina!', oficina: oficina}
        } else {
            return {status: false, mensagem: 'ERRO, oficina não existe!'}
        }   
    },

    alterar: async (id, novosDados) => {
        const oficina = await Oficina.findOne({where: {id: id}})

        if (!oficina) {
            return {status: false, mensagem: 'ERRO, oficina não existe!'}
        }

        if (validateOficina(novosDados).status) {
            await oficina.update(
                novosDados, 
                {where: {id: id}}
            )

            oficinaAtualizada = await Oficina.findOne({
                where: {id: id}
            })    

            return {status: true, mensagem: 'Sucesso ao alterar oficina!', oficinaAtualizada: oficinaAtualizada}
        } else {
            return validateOficina(novosDados)
        }
    },

    deletar: async (id) => {
        const oficina = await Oficina.findOne({
            where: { id: id },
        });

        // Valida se usuário informado existe
        if (oficina) { 
            await Oficina.destroy({where: { id: id }})

            return {status: true, mensagem: 'Sucesso ao deletar oficina!', oficinaExcluido: oficina}
        } else {
            return {status: false, mensagem: 'ERRO, oficina não existe!'}
        }
    },

    listar: async () => {
        return await PostModel.findAll()
    },
}