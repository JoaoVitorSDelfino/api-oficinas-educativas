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
    res.send('teste')
});

port = process.env.PORT

app.use('/', require('./routes/protected/protected'))
app.use('/', require('./routes/login'))

app.listen(port, function() {
    console.log('Server is running at port ' + port)
})