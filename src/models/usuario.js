const Sequelize = require('sequelize');
const db = require('../db/connection');

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
    login: {
        type: Sequelize.STRING,
        unique: true,
    },
}, {
        // Cria um login para o usuário baseado em seu id único
        // Exemplo: id: 23
        //          login: U0023
        hooks: {
            afterCreate: (usuario, options) => {
                usuario.login = `U${String(usuario.id).padStart(4, '0')}`;
                return usuario.save();
            },
        },
    }
)

module.exports = Usuario