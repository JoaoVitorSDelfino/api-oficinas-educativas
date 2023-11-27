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
Participante.belongsTo(Oficina, { foreignKey: 'idOficina', allowNull: false })
Participante.belongsTo(Usuario, { foreignKey: 'idUsuario', allowNull: false })

module.exports = Participante