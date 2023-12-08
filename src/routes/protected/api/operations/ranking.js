const express = require('express')
const router = express.Router()

const Oficina = require('../../../../controller/oficinaController')
const Usuario = require('../../../../controller/usuarioController')
const Organizador = require('../../../../controller/organizadorController')

// Essa rota cria um ranking de usuarios que mais
// organizaram oficinas
router.get('/ranking', async (req, res) => {
    try {
        token = req.headers.authorization

        // Obtém a lista de todos os usuários e organizadores
        const dadosUsuarios = await Usuario.listar()
        const dadosOrganizadores = await Organizador.listar()

        let ranking = [],
            posicao = 0,
            contador = 1

        for (let i = 0; i < dadosUsuarios.length; i++) {
            for (let j = 0; j < dadosOrganizadores.length; j++) {
                if (dadosUsuarios[i].id == dadosOrganizadores[j].idUsuario) {
                    ranking[posicao] = {
                        nome: dadosUsuarios[i].nome,
                        oficinasOrganizadas: contador
                    }
                    
                    contador++
                }
            }

            if (contador != 1) {
                posicao++
            }
            contador = 1
        }

        // Organiza o ranking em ordem decrescente de oficinasOrganizadas,
        // ou seja, quanto mais oficinasOrganizadas maior o ranking
        for (var i = 0; i < ranking.length - 1; i++) {
            for (var j = 0; j < ranking.length - 1 - i; j++) {
                // Troca os elementos se estiverem na ordem errada (decrescente)
                if (ranking[j].oficinasOrganizadas < ranking[j + 1].oficinasOrganizadas) {
                    var temp = ranking[j];
                    ranking[j] = ranking[j + 1];
                    ranking[j + 1] = temp;
                }
            }
        }

        res.status(201).json({status: true, mensagem: 'Sucesso ao obter ranking de organizadores!', ranking: ranking})
    } catch (error) {
        res.status(400).json({error: 'ERRO ao acessar a rota de ranking'})
    }
})

module.exports = router