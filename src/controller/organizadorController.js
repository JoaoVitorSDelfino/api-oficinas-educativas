const Organizador = require('../models/organizador')
const {validateOrganizador} = require('./validate/organizadorValidation')

module.exports = {
    criar: async (organizador) => {
        // Valida se valores digitados são válidos
        if (validateOrganizador(organizador).status) {
            const {idUsuario, idOficina} = organizador

            const organizadorExiste = await Organizador.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se organizador que deseja criar já existe
            if (!organizadorExiste) {
                let novoOrganizador

                // Adicionar o organizador
                try {
                    novoOrganizador = await Organizador.create(organizador)
                } catch (error) {
                    // Caso algum id informado não exista
                    if (error.name === 'SequelizeForeignKeyConstraintError') {
                        return {status: false, mensagem: 'ERRO, usuário ou oficina não existe!'}
                    }
                }
    
                return {status: true, mensagem: 'Organizador adicionado com sucesso!', organizador: novoOrganizador}
            } else {
                return {status: false, mensagem: 'ERRO, organizador já existe.'}
            }
        } else {
            return validateOrganizador(organizador)
        }
    },

    buscarPorId: async (id) => {
        const organizador = await Organizador.findOne({where: {id: id}})

        if (organizador) {
            return {status: true, mensagem: 'Sucesso ao buscar organizador!', organizador: organizador}
        } else {
            return {status: false, mensagem: 'ERRO, organizador não existe!'}
        }  
    },

    alterar: async (id, novosDados) => {
        // Valida se valores digitados são válidos
        if (validateOrganizador(novosDados).status) {
            const {idUsuario, idOficina} = novosDados

            const organizadorExiste = await Organizador.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se organizador que deseja editar já existe
            if (!organizadorExiste) {
                try {
                    await Organizador.update(
                        novosDados, 
                        {where: {id: id}}
                    )
                } catch (error) {
                    // Caso algum id informado não exista
                    if (error.name === 'SequelizeForeignKeyConstraintError') {
                       return {status: false, mensagem: 'ERRO, usuário ou oficina não existe!'}
                    }
                }

                organizadorAtualizado = await Organizador.findOne({
                    where: {id: id}
                })

                return {status: true, mensagem: 'Organizador alterado com sucesso!', organizadorAtualizado: organizadorAtualizado}
            } else {
                return {status: false, mensagem: 'ERRO, organizador já existe.'}
            }
        } else {
            return {status: false, mensagem: 'ERRO, organizador não existe!'}
        }
    },

    deletar: async (id) => {
        const organizador = await Organizador.findOne({
            where: { id: id },
        })

        // Valida se organizador informado existe
        if (organizador) { 
            await Organizador.destroy({where: { id: id }})

            return {status: true, mensagem: 'Sucesso ao deletar organizador!', organizadorExcluido: organizador}
        } else {
            return {status: false, mensagem: 'ERRO, organizador não existe!'}
        }
    },

    deletarPorIdUsuarioEOficina: async (idUsuario, idOficina) => {
        const organizador = await Organizador.findOne({
            where: { 
                idUsuario: idUsuario,
                idOficina: idOficina 
            },
        })

        // Valida se organizador informado existe
        if (organizador) { 
            await Organizador.destroy({
                where: { 
                    idUsuario: idUsuario,
                    idOficina: idOficina 
                }
            })

            return {status: true, mensagem: 'Sucesso ao deletar organizador!', organizadorExcluido: organizador}
        } else {
            return {status: false, mensagem: 'ERRO, organizador não existe!'}
        }
    },

    deletarOrganizadoresDeOficina: async (idOficina) => {
        const organizadoresDeletados = await Organizador.findAll({
            where: { idOficina: null },
        })

        await Organizador.destroy({where: { idOficina: null }})

        return {status: true, mensagem: 'Sucesso ao deletar organizadores!', organizadoresDeletados: organizadoresDeletados}
    },

    buscarPorIdUsuarioEOficina: async (idUsuario, idOficina) => {
        const organizador = await Organizador.findOne({
            where: { 
                        idUsuario: idUsuario,
                        idOficina: idOficina,
                   },
        })

        if (organizador) {
            return {status: true, mensagem: 'Sucesso ao buscar organizador!', organizador: organizador}
        } else {
            return {status: false, mensagem: 'ERRO, organizador não existe!'}
        } 
    },

    listar: async () => {
        return await PostModel.findAll()
    },
}