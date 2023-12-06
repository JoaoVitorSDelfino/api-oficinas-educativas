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
})

Organizador.belongsTo(Usuario, { foreignKey: 'idUsuario', onDelete: 'CASCADE' })

module.exports = Organizador