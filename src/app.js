require('dotenv').config();

const express = require("express")
const app = express()

// Body parser
const bodyParser = require('body-parser')

app.use(bodyParser.json())

// Conexão com o banco de dados
const db = require('./db/connection')

db.authenticate().then(() => {
    console.log("Conectou ao banco de dados com sucesso")
}).catch(err => {
    console.log("Ocorreu um erro ao conectar", err)
})

app.get('/', (req, res) => {
    res.send('')
});

port = process.env.PORT

app.use('/', require('./routes/protected/protected'))
app.use('/', require('./routes/login'))
app.use('/', require('./routes/install'))

// Documentação swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_doc.json')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(port, function() {
    console.log('Server is running at port ' + port)
})