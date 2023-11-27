const Sequelize = require('sequelize')
const db = require('../db/connection')

const Oficina = db.define('oficina', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        primaryKey: true,
        unique: true, 
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    descricao: {
        type: Sequelize.STRING,
    },
    data: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    local: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

const Usuario = db.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        primaryKey: true,
        unique: true, 
        autoIncrement: true,
    },
    funcao: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

const Participante = db.define('participante', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        primaryKey: true,
        unique: true, 
        autoIncrement: true,
    },
    presente: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    nota: {
        type: Sequelize.REAL,
        allowNull: false,
    },
    idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    idOficina: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
})

const Organizador = db.define('organizador', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        primaryKey: true,
        unique: true, 
        autoIncrement: true,
    },
    idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    idOficina: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
})

module.exports = {
    Oficina, 
    Usuario,
    Participante,
    Organizador
}