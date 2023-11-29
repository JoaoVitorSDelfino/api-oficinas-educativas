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
    idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    idOficina: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
})

// Definindo 'pertence a'
Organizador.belongsTo(Oficina, { foreignKey: 'idOficina', allowNull: false });
Organizador.belongsTo(Usuario, { foreignKey: 'idUsuario', allowNull: false });

module.exports = Organizador