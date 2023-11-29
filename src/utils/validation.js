function validarCampoString(valor, mensagemErro) {
    if (valor == '' || valor == null) {
        console.error(`ERRO, ${mensagemErro} não pode ser vazio!`)
        return false
    } else {
        return true
    }
}

function normalizarString(str) {
    return str
        .toLowerCase()                      // Converter para minúsculas
        .normalize('NFD')                   // Normalizar para decompor acentos e caracteres especiais
        .replace(/[\u0300-\u036f]/g, '');   // Remover caracteres acentuados
}

const validarOficina = (dados) => {
    let {nome, descricao, data, local} = dados
        
    // Validar campos
    if (!validarCampoString(nome)) {
        return {status: false, mensagem: 'ERRO, nome não pode ser vazio!'}
    }

    if (validarData(data).status === false) {
        return {status: false, mensagem: validarData(data).mensagem}
    }

    if (!validarCampoString(local)) {
        return {status: false, mensagem: 'ERRO, local não pode ser vazio!'}
    }

    return {status: true, mensagem: ''}
}

const validarData = (data) => {
    // Define padrão DD-MM-AAAA
    const padraoData = /^\d{2}-\d{2}-\d{4}$/

    if (data == '' || data == null) {
        return {status: false, mensagem: 'ERRO, data não pode ser vazia!'}
    } else if (!padraoData.test(data)) {
        return {status: false, mensagem: 'ERRO, formato de data inválido! Use o formato DD-MM-AAAA.'}
    } else {
        let [dia, mes, ano] = data.split('-')

        dia = parseInt(dia, 10)
        mes = parseInt(mes, 10)
        ano = parseInt(ano, 10)

        // Verifica se dia ou mês digitados são válidos
        // Valida também para anos bissextos
        if (dia > 31 || (dia > 28 && mes == 2 && (ano % 4 != 0)) ||(dia > 29 && mes == 2 && (ano % 4 == 0))) {
            return {status: false, mensagem: 'ERRO, o dia informado é inválido!'}
        } else if (mes < 1 || mes > 12) {
            return {status: false, mensagem: 'ERRO, o mês informado é inválido!'}
        }
    }

    return {status: true, mensagem: ''}
};

const validarUsuario = (dados) => {
    let {funcao, nome, senha, email} = dados
        
    // Validar campos
    if (!validarCampoString(funcao)) {
        return {status: false, mensagem: 'ERRO, função não pode ser vazia!'}
            // funcao != 'Coordenador' || funcao != 'Professor' | funcao != 'Aluno'
    } else if (!validarFuncao(funcao)) {
        return {status: false, mensagem: 'ERRO, função digitada é inválida! Tente coordenador, professor ou aluno'}
    }

    if (!validarCampoString(nome)) {
        return {status: false, mensagem: 'ERRO, nome não pode ser vazio!'}
    }

    if (!validarCampoString(senha)) {
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

function validarFuncao(funcao) {
    const funcoesValidas = ['coordenador', 'professor', 'aluno']

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

module.exports = {
    validarCampoString,
    validarOficina,
    validarData,
    validarUsuario
}