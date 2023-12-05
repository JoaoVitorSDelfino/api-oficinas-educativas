const Participante = require('../models/participante')
const {validateParticipante} = require('./validate/participanteValidation')

module.exports = {
    criar: async (participante) => {
        // Valida se valores digitados são válidos
        if (validateParticipante(participante).status) {
            const {idUsuario, idOficina} = participante

            const participanteExiste = await Participante.findOne({
                where: {
                    idUsuario,
                    idOficina
                },
            })
    
            // Verifica se participante que deseja criar já existe
            if (!participanteExiste) {
                // Adicionar o participante
                const novoParticipante = await Participante.create(participante)
    
                return {status: true, mensagem: 'Sucesso ao adicionar participante!', participante: novoParticipante}
            } else {
                return {status: false, mensagem: 'ERRO, participante já existe!'}
            }
        } else {
            return validateParticipante(participante)
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

    alterar: async (id, novosDados) => {
        participante = await Participante.findOne({
            where: {id: id}
        })

        console.log(novosDados)

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
                await Participante.update(
                    novosDados, 
                    {where: {id: id}}
                )

                participanteAtualizado = await Participante.findOne({
                    where: {id: id}
                })

                return {status: true, mensagem: 'Participante alterado com sucesso!', participanteAtualizado: participanteAtualizado}
            } else {
                return {status: false, mensagem: 'ERRO, participante já existe.'}
            }
        } else {
            return {error: validateParticipante(novosDados)}
        }
    },

    deletar: async (id) => {
        const participante = await Participante.findOne({
            where: { id: id },
        });

        // Valida se participante informado existe
        if (participante) { 
            await Participante.destroy({where: { id: id }})

            return {status: true, mensagem: 'Sucesso ao deletar participante!', participanteExcluido: participante}
        } else {
            return {status: false, mensagem: 'ERRO, participante não existe!'}
        }
    },

    listar: async () => {
        return await PostModel.findAll()
    },
}