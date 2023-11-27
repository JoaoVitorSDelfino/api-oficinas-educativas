const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

app.get('/', (req, res) => {
    res.send('teste')
});

let port = 3000

app.listen(port, function() {
    console.log('Server is running at port ' + port)
})