const validarCampo = require('./controller').validarCampo

function normalizarString(str) {
    return str
        .toLowerCase()                      // Converter para minúsculas
        .normalize('NFD')                   // Normalizar para decompor acentos e caracteres especiais
        .replace(/[\u0300-\u036f]/g, '');   // Remover caracteres acentuados
}

function validarFuncao(funcao) {
    const funcoesValidas = ['professor', 'aluno']

    // Verificar se o cargo fornecido está na lista de cargos válidos
    if (funcoesValidas.includes(normalizarString(funcao))) {
        return true
    }

    return false
}

function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regexEmail.test(email);
}

const validateUsuario = (dados) => {
    let {funcao, nome, senha, email} = dados
        
    // Validar campos
    if (!validarCampo(funcao)) {
        return {status: false, mensagem: 'ERRO, função não pode ser vazia!'}
    // funcao != 'Professor' | funcao != 'Aluno'
    } else if (!validarFuncao(funcao)) {
        return {status: false, mensagem: 'ERRO, função digitada é inválida! Tente professor ou aluno'}
    }

    if (!validarCampo(nome)) {
        return {status: false, mensagem: 'ERRO, nome não pode ser vazio!'}
    }

    if (!validarCampo(senha)) {
        return {status: false, mensagem: 'ERRO, senha não pode ser vazia!'}
    } else if (senha.length < 8) {
        return {status: false, mensagem: 'ERRO, senha precisa ser maior!'}
    } else if (senha.length > 20){
        return {status: false, mensagem: 'ERRO, senha precisa ser menor!'}
    }

    if (!validarEmail(email)) {
        return {status: false, mensagem: 'ERRO, email precisa conter um @!'}
    }

    return {status: true, mensagem: ''}
}

const validateAdmin = (dados) => {
    let {nome, senha, email} = dados

    if (!validarCampo(nome)) {
        return {status: false, mensagem: 'ERRO, nome não pode ser vazio!'}
    }

    if (!validarCampo(senha)) {
        return {status: false, mensagem: 'ERRO, senha não pode ser vazia!'}
    } else if (senha.length < 8) {
        return {status: false, mensagem: 'ERRO, senha precisa ser maior!'}
    } else if (senha.length > 20){
        return {status: false, mensagem: 'ERRO, senha precisa ser menor!'}
    }

    if (!validarEmail(email)) {
        return {status: false, mensagem: 'ERRO, email precisa conter um @!'}
    }

    return {status: true, mensagem: ''}
}

module.exports = {
    validateUsuario,
    validateAdmin
}