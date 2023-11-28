const validarCampoString = (valor, mensagemErro) => {
    if (valor == '' || valor == null) {
        console.error(`ERRO, ${mensagemErro} não pode ser vazio!`)
        return false
    } else {
        return true
    }
};

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

module.exports = {
    validarCampoString,
    validarOficina,
    validarData
}