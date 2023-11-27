const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

// Conexão com o banco de dados
const db = require('./db/connection')

db.authenticate().then(() => {
    console.log("Conectou ao banco de dados com sucesso");
}).catch(err => {
    console.log("Ocorreu um erro ao conectar", err);
})

app.get('/', (req, res) => {
    res.send('teste')
});

let port = 3000

app.listen(port, function() {
    console.log('Server is running at port ' + port)
})