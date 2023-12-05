const express = require('express')
const router = express.Router()
const Oficina = require('../../../controller/oficinaController')

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyAdmin')

const validation = require('../../../controller/controller')

// Listar lista de oficinas cadastradas
router.get('/list/:limite/:pagina', async (req, res) => {
    try {
        let {limite, pagina} = req.params

        limite = parseInt(limite)
        pagina = (pagina - 1) * 5

        if (validation.validarBuscaLista(limite, pagina).status) {
            const oficinas = await Oficina.findAll({offset: pagina, limit: limite})
            const jsonOficinas = JSON.stringify({lista: oficinas}, null, 2)
    
            res.setHeader('Content-Type', 'application/json')
            res.end(jsonOficinas)
        } else {
            res.status(500).json({error: validation.validarBuscaLista(limite, pagina).mensagem})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO buscar lista de oficinas'})
    }
})

// Adicionar nova oficina
router.post('/add', verifyProfessor, async (req, res) => {
    try {
        const oficina = await Oficina.criar(req.body)

        if (oficina.status) {
            res.status(201).json(oficina)
        } else {
            res.status(400).json(oficina)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao criar oficina.'})
    }
})

// Pesquisar oficina específica pelo id
router.get('/view/:id', async (req, res) => {
    try {
        const oficina = await Oficina.buscarPorId(req.params.id)

        // Valida se usuário foi encontrado
        if (oficina.status) {
            res.status(201).json(oficina)
        } else {
            res.status(400).json(oficina)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao buscar oficina'})
    }
})

// Alterar uma oficina pelo id
router.put('/edit/:id', verifyProfessor, async (req, res) => {
    try {
        /*// Verifica a role do usuário
        const role = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.role
        })
        // Verifica o id do editor (quem deseja editar um usuário)
        const idEditor = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.id
        })

        if (role == 'professor') {
            
        } */

        oficinaAtualizada = await Oficina.alterar(req.params.id, req.body)

        if (oficinaAtualizada.status) {
            res.status(200).json(oficinaAtualizada)
        } else {
            res.status(400).json(oficinaAtualizada)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao editar oficina.'})
    }
})

// Deletar uma oficina pelo id
router.delete('/delete/:id', async (req, res) => {
    try {
        const oficinaExcluida = await Oficina.deletar(req.params.id)

        if (oficinaExcluida.status) {
            res.status(200).json(oficinaExcluida)
        } else {
            res.status(400).json(oficinaExcluida)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao deletar oficina.'})
    }
})

module.exports = router