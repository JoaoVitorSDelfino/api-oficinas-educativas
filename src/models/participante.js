const Sequelize = require('sequelize')
const db = require('../db/connection')
const Oficina = require('./oficina')
const Usuario = require('./usuario')

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
})

Participante.belongsTo(Usuario, { foreignKey: 'idUsuario', onDelete: 'CASCADE' })

module.exports = Participante