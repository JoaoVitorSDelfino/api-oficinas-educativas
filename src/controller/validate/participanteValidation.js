const validarCampo = require('../controller').validarCampo

const validateParticipante = (dados) => {
    const {idUsuario, idOficina, presente, nota} = dados

    // Valida IDs digitados
    if (!validarCampo(idUsuario) || !validarCampo(idUsuario)) {
        return {status: false, mensagem: 'ERRO, id não pode ser nulo!'}
    } else if (!Number.isInteger(idUsuario) || !Number.isInteger(idOficina)) {
        return {status: false, mensagem: 'ERRO, id informado deve ser um número inteiro!'}
    } 

    // Valida presente
    // 0 - Ausente
    // 1 - Presente
    if (presente == null) {
        return {status: false, mensagem: 'ERRO, campo presente não pode ser nulo!'}
    } else if (presente !== 1 && presente !== 0 || !Number.isInteger(presente)) {
        return {status: false, mensagem: 'ERRO, campo presente deve ser 0 (para ausente) e 1 (para presente)!'}
    }

    // Valida nota,
    // valores aceitos são de 0 até 10
    if (!validarCampo(nota)) {
        return {status: false, mensagem: 'ERRO, campo nota não pode ser nulo!'}
    } else if (isNaN(nota)) {
        return {status: false, mensagem: 'ERRO, nota deve ser um número!'}
    } else if (nota < 0) {
        return {status: false, mensagem: 'ERRO, nota não pode ser negativa! São aceitos apenas valores de 0 até 10.'}
    } else if (nota > 10) {
        return {status: false, mensagem: 'ERRO, nota deve ser de 0 até 10!'}
    }

    return {status: true, mensagem: ''}
}

module.exports = {validateParticipante}