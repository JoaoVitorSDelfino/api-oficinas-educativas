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

app.use('/login', require('./routes/authentication/login'))
app.use('/install', require("./routes/install"))
app.use('/drop-data', require('./routes/drop-data'))

app.use('/oficinas', require('./routes/oficinas'))
app.use('/usuarios', require('./routes/usuarios'))
app.use('/organizadores', require('./routes/organizadores'))
app.use('/participantes', require('./routes/participantes'))

let port = 3000

app.listen(port, function() {
    console.log('Server is running at port ' + port)
})