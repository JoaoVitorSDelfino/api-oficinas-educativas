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

// Definindo relações
Oficina.hasMany('participante', { foreignKey: 'idOficina' })
Oficina.hasMany('organizador', { foreignKey: 'idOficina' })

module.exports = Oficina