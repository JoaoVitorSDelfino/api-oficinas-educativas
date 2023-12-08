const express = require('express')
const router = express.Router()

const Oficina = require('../../../controller/oficinaController')
const Organizador = require('../../../controller/organizadorController')
const Participante = require('../../../controller/participanteController')

const jwt = require('jsonwebtoken')
const verifyProfessor = require('../../../middlewares/verifyProfessor')
const verifyAdmin = require('../../../middlewares/verifyAdmin')

// Listar lista de oficinas cadastradas
router.get('/list/:limite/:pagina', async (req, res) => {
    try {
        let {limite, pagina} = req.params

        const listaPaginada = await Oficina.listarPaginacao(limite, pagina)

        if (listaPaginada.status) {
            res.status(200).json(listaPaginada)
        } else {
            res.status(400).json(listaPaginada)
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'ERRO buscar lista de oficinas'})
    }
})

// Adicionar nova oficina
router.post('/add', verifyProfessor, async (req, res) => {
    try {
        token = req.headers.authorization

        // Verifica o id do editor (quem deseja adicionar uma oficina)
        const idEditor = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.id
        })

        const oficina = await Oficina.criar(req.body)

        if (oficina.status) {
            // Cria o organizador da oficina (pessoa logada),
            // que pode mais tarde adicionar outros organizadores
            const organizadorPadrao = {idUsuario: idEditor, idOficina: oficina.oficina.id}
            await Organizador.criar(organizadorPadrao)

            res.status(201).json({adicionar: oficina, organizadorPadrao: organizadorPadrao})
        } else {
            res.status(400).json({adicionar: oficina})
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

        // Valida se oficina foi encontrada
        if (oficina.status) {
            res.status(201).json({busca: oficina})
        } else {
            res.status(400).json({busca: oficina})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao buscar oficina'})
    }
})

// Alterar uma oficina pelo id
router.put('/edit/:id', verifyProfessor, async (req, res) => {
    try {
        token = req.headers.authorization

        // Verifica a role do editor (quem deseja alterar uma oficina)
        const role = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.role
        })
        // Verifica o id do editor
        const idEditor = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.id
        })

        const oficinaExiste = await Oficina.buscarPorId(req.params.id)

        if (!oficinaExiste.status) {
            res.status(400).json({status: false, mensagem: 'ERRO, oficina não existe!'})
            return
        }

        const organizadorExiste = await Organizador.buscarPorIdUsuarioEOficina(idEditor, req.params.id)

        // Apenas professores organizadores ou coordenadores 
        // (não necessariamente organizadores) podem editar a oficina
        if (organizadorExiste.status || role == 'coordenador') {
            oficinaAtualizada = await Oficina.alterar(req.params.id, req.body)

            if (oficinaAtualizada.status) {
                res.status(200).json({atualizar: oficinaAtualizada})
            } else {
                res.status(400).json({atualizar: oficinaAtualizada})
            }
        } else {
            res.status(400).json({status: false, mensagem: 'ERRO, você não tem permissão para editar oficinas em que você não é um organizador!'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao editar oficina.'})
    }
})

// Deletar uma oficina pelo id
router.delete('/delete/:id', verifyProfessor, async (req, res) => {
    try {
        token = req.headers.authorization

        // Verifica a role do editor (quem deseja alterar uma oficina)
        const role = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.role
        })
        // Verifica o id do editor
        const idEditor = jwt.verify(token, 'secret', (err, decoded) => {
            return decoded.id
        })

        const oficinaExiste = await Oficina.buscarPorId(req.params.id)

        if (!oficinaExiste.status) {
            res.status(400).json({status: false, mensagem: 'ERRO, oficina não existe!'})
            return
        }

        const organizadorExiste = await Organizador.buscarPorIdUsuarioEOficina(idEditor, req.params.id)

        // Apenas professores organizadores ou coordenadores 
        // (não necessariamente organizadores) podem excluir a oficina
        if (organizadorExiste.status || role == 'coordenador') {
            const oficinaExcluida = await Oficina.deletar(req.params.id)

            if (oficinaExcluida.status) {
                const organizadoresDeletados = await Organizador.deletarOrganizadoresDeOficina(req.params.id)
                const participantesDeletados = await Participante.deletarParticipantesDeOficina(req.params.id)

                res.status(200).json({excluir: {
                                        oficinaExcluida, 
                                        organizadoresDeletados: organizadoresDeletados.organizadoresDeletados,
                                        participantesDeletados: participantesDeletados.participantesDeletados
                                    }})
            } else {
                res.status(400).json({excluir: oficinaExcluida})
            }
        } else {
            res.status(400).json({status: false, mensagem: 'ERRO, você não tem permissão para excluir oficinas em que você não é um organizador!'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'ERRO ao deletar oficina.'})
    }
})

module.exports = router