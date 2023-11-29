const Sequelize = require('sequelize')
const db = require('../db/connection')
const Oficina = require('./oficina')
const Usuario = require('./usuario')

const Organizador = db.define('organizadores', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false, 
        primaryKey: true,
        unique: true, 
        autoIncrement: true,
    },
    nomeUsuario: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nomeOficina: {
        type: Sequelize.STRING,
        allowNull: false,
    },
})

Organizador.belongsTo(Usuario, { foreignKey: 'idUsuario' })

module.exports = Organizador