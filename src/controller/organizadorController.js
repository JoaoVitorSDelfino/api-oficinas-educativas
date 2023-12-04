const validarCampo = require('./controller').validarCampo

const validateOrganizador = (dados) => {
    const {idUsuario, idOficina} = dados

    if (!validarCampo(idUsuario) || !validarCampo(idUsuario)) {
        return {status: false, mensagem: 'ERRO, id não pode ser nulo!'}
    } else if (!Number.isInteger(idUsuario) || !Number.isInteger(idOficina)) {
        return {status: false, mensagem: 'ERRO, id informado deve ser um número inteiro!'}
    }

    return {status: true, mensagem: ''}
}

module.exports = validateOrganizador