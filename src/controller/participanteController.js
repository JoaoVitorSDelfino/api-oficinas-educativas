const Participante = require('../models/participante')
const {validateParticipante} = require('./validate/participanteValidation')

module.exports = {
    criar: async (dados) => {
        // Valida se valores digitados são válidos
        if (validateParticipante(dados).status) {
            const {idUsuario, idOficina} = dados

            const participanteExiste = await Participante.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se participante que deseja criar já existe
            if (!participanteExiste) {
                let novoParticipante

                // Adicionar o participante
                try {
                    novoParticipante = await Participante.create(dados)
                } catch (error) {
                    // Caso algum id informado não exista
                    if (error.name === 'SequelizeForeignKeyConstraintError') {
                        return {status: false, mensagem: 'ERRO, usuário ou oficina não existe!'}
                    }
                }

                return {status: true, mensagem: 'Sucesso ao adicionar participante!', participante: novoParticipante}
            } else {
                return {status: false, mensagem: 'ERRO, participante já existe!'}
            }
        } else {
            return validateParticipante(dados)
        }
    },

    buscarPorId: async (id) => {
        const participante = await Participante.findOne({where: {id: id}})

        if (participante) {
            return {status: true, mensagem: 'Sucesso ao buscar participante!', participante: participante}
        } else {
            return {status: false, mensagem: 'ERRO, participante não existe!'}
        }   
    },

    buscarPorIdUsuarioEOficina: async (idUsuario, idOficina) => {
        const participante = await Participante.findOne({
            where: { 
                        idUsuario: idUsuario,
                        idOficina: idOficina,
                   },
        })

        if (participante) {
            return {status: true, mensagem: 'Sucesso ao buscar participante!', participante: participante}
        } else {
            return {status: false, mensagem: 'ERRO, participante não existe!'}
        }
    },

    alterar: async (id, novosDados) => {
        // Valida se valores digitados são válidos
        if (validateParticipante(novosDados).status) {
            const {idUsuario, idOficina} = novosDados

            const participanteExiste = await Participante.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se participante que deseja editar já existe
            // Se o participante a ser editado já existe, mas possui
            // mesmo id que o parâmetro, então o participante pode ser editado
            if (!participanteExiste || (participanteExiste && participanteExiste.id == id)) {
                try {
                    await Participante.update(
                        novosDados, 
                        {where: {id: id}}
                    )
                } catch (error) {
                    // Caso algum id informado não exista
                    if (error.name === 'SequelizeForeignKeyConstraintError') {
                        return {status: false, mensagem: 'ERRO, usuário ou oficina não existe!'}
                    }
                }

                participanteAtualizado = await Participante.findOne({
                    where: {id: id}
                })

                return {status: true, mensagem: 'Participante alterado com sucesso!', participanteAtualizado: participanteAtualizado}
            } else {
                return {status: false, mensagem: 'ERRO, participante já existe.'}
            }
        } else {
            return validateParticipante(novosDados)
        }
    },

    alterarPorIdUsuarioEOficina: async (idUsuario, idOficina, novosDados) => {
        idUsuario = parseInt(idUsuario)
        idOficina = parseInt(idOficina)

        const presente = novosDados.presente
        const nota = novosDados.nota

        novosDados = {idUsuario, idOficina, presente, nota}

        // Valida se valores digitados são válidos
        if (validateParticipante(novosDados).status) {
            const participanteExiste = await Participante.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se participante que deseja editar já existe
            // Se o participante a ser editado já existe, mas possui
            // mesmo id que o parâmetro, então o participante pode ser editado
            if (!participanteExiste || (participanteExiste && participanteExiste.idUsuario == idUsuario && participanteExiste.idOficina == idOficina)) {
                const sucesso = await Participante.update(
                                    novosDados, 
                                    {where: {
                                        idUsuario: idUsuario,
                                        idOficina: idOficina
                                    }}
                                )

                if (sucesso == 0) {
                    return {status: false, mensagem: 'ERRO, participante não existe!'}
                }

                participanteAtualizado = await Participante.findOne({
                    where: {
                        idUsuario: idUsuario,
                        idOficina: idOficina
                    }
                })

                return {status: true, mensagem: 'Participante alterado com sucesso!', participanteAtualizado: participanteAtualizado}
            } else {
                return {status: false, mensagem: 'ERRO, participante já existe.'}
            }
        } else {
            return validateParticipante(novosDados)
        }
    },

    deletar: async (id) => {
        const participante = await Participante.findOne({
            where: { id: id },
        })

        // Valida se participante informado existe
        if (participante) { 
            await Participante.destroy({where: { id: id }})

            return {status: true, mensagem: 'Sucesso ao deletar participante!', participanteExcluido: participante}
        } else {
            return {status: false, mensagem: 'ERRO, participante não existe!'}
        }
    },

    deletarPorIdUsuarioEOficina: async (idUsuario, idOficina) => {
        const participante = await Participante.findOne({
            where: { 
                idUsuario: idUsuario,
                idOficina: idOficina
            },
        })

        // Valida se participante informado existe
        if (participante) { 
            await Participante.destroy({
                where: { 
                    idUsuario: idUsuario,
                    idOficina: idOficina
                }
            })

            return {status: true, mensagem: 'Sucesso ao deletar participante!', participanteExcluido: participante}
        } else {
            return {status: false, mensagem: 'ERRO, participante não existe!'}
        }
    },

    listar: async () => {
        return await PostModel.findAll()
    },
}