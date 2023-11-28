const validarCampoString = (valor, mensagemErro) => {
    if (valor == '' || valor == null) {
        console.error(`ERRO, ${mensagemErro} não pode ser vazio!`)
        return false
    } else {
        return true
    }
};

const validarData = (data) => {
    const padraoData = /^\d{2}-\d{2}-\d{4}$/;

    if (data == '' || data == null) {
        return {status: false, mensagem: 'ERRO, data não pode ser vazia!'};
    } else if (!padraoData.test(data)) {
        return {status: false, mensagem: 'Formato de data inválido. Use o formato DD-MM-AAAA.'};
    }

    return {status: true, mensagem: ''};
};

module.exports = {
    validarCampoString,
    validarData
}