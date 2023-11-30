const oficinas = [
    {
        nome: "Tecnologias Assistivas para Braille e Libras",
        descricao: "O objetivo dessa oficina é conhecer, testar e praticar atividades utilizando ferramentas assistivas destinas a pessoas mudas e cegas",
        data: "12-12-2023",
        local: "Sala A-001"
    },

    {
        nome: "Introdução aos calouros - 2023-2",
        descricao: "Oficina interativa destinada a introduzir a universidade para calouros e novatos",
        data: "05-07-2023",
        local: "Sala A-104"
    },

    {
        nome: "Conscientização sobre aquecimento global e reciclagem",
        descricao: "Oficina educativa envolvendo assuntos relacionados a mudanças climáticas e reaproveitamento de materiais",
        data: "30-11-2023",
        local: "Sala I-101"
    },

    {
        nome: "Clube do Livro - Terceira Edição",
        descricao: "Na edição deste mês, vamos discutir o clássico literário Dom Casmurro, do Machado de Assis!",
        data: "30-11-2023",
        local: "Sala A-106"
    },

    {
        nome: "Jogos de Mesa",
        descricao: "Venha jogar! Se possível, traga um jogo de tabuleiro de sua preferência",
        data: "08-12-2023",
        local: "Sala P-105"
    },
]

const usuarios = [
    {
        nome: "José Matias",
        funcao: "professor",
        senha: "kDiabsydV!2018h8",
        email: "josematias@gmail.com"
    },

    {
        nome: "Vanessa Five",
        funcao: "coordenador",
        senha: "fnaf1987",
        email: "vanny@gmail.com"
    },

    {
        nome: "Zhong Xhina",
        funcao: "aluno",
        senha: "ccpnumber1",
        email: "bingqiling@gmail.com"
    },

    {
        nome: "Roger Dourado",
        funcao: "aluno",
        senha: "1pieceisREAL",
        email: "roger@gmail.com"
    },

    {
        nome: "William Indali",
        funcao: "professor",
        senha: "hurheruqyd8v1",
        email: "bowil@gmail.com"
    },

    {
        nome: "Doinb Dawei",
        funcao: "aluno",
        senha: "3000farm20minhack",
        email: "ryzedawei@gmail.com"
    },

    {
        nome: "Rodrigo Fallen",
        funcao: "professor",
        senha: "presenteota2019",
        email: "rodrigofallen@gmail.com"
    },

    {
        nome: "Margaret Lancaster",
        funcao: "professor",
        senha: "132udvt172vcT",
        email: "margaretlancaster@gmail.com"
    },

    {
        nome: "Ronaldo Torres",
        funcao: "aluno",
        senha: "dqw87d5cv",
        email: "ronaldo@gmail.com"
    },

    {
        nome: "Daniel Matos",
        funcao: "aluno",
        senha: "13dbn78q6wctv",
        email: "danielmatos@gmail.com"
    },
]

const organizadores = [
    {
        idUsuario: 1,
        idOficina: 2
    },

    {
        idUsuario: 5,
        idOficina: 1
    },

    {
        idUsuario: 2,
        idOficina: 3
    },

    {
        idUsuario: 7,
        idOficina: 5
    },

    {
        idUsuario: 8,
        idOficina: 7
    },
]

const participantes = [
    {
        presente: 1,
        nota: 7.8,
        idUsuario: 3,
        idOficina: 1
    },

    {
        presente: 0,
        nota: 0.0,
        idUsuario: 4,
        idOficina: 1
    },

    {
        presente: 1,
        nota: 10.0,
        idUsuario: 6,
        idOficina: 2
    },

    {
        presente: 1,
        nota: 5.4,
        idUsuario: 9,
        idOficina: 4
    },

    {
        presente: 0,
        nota: 0.0,
        idUsuario: 11,
        idOficina: 5
    },
]

module.exports = {
    oficinas,
    usuarios,
    organizadores,
    participantes
}