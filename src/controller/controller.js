// Valida campos vazios e o método de listagem

function validarCampo (valor) {
    if (valor == '' || valor == null) {
        return false
    } else {
        return true
    }
}

function validarBuscaLista (limite, pagina) {
    const valoresLimite = [5, 10, 30]

    if (!valoresLimite.includes(limite)) {
        return {status: false, mensagem: 'ERRO, primeiro parametro (limite) deve ser um numero (inteiro) equivalente a 5, 10 ou 30!'}
    }

    if (pagina < 0) {
        return {status: false, mensagem: 'ERRO, segundo parametro (página) deve ser positivo e diferente de 0!'}
    } else if (!Number.isInteger(pagina)) {
        return {status: false, mensagem: 'ERRO, primeiro parametro (página) deve ser um numero inteiro!'}
    }

    return {status: true, mensagem: ''}
}

module.exports = {
    validarCampo,
    validarBuscaLista
}