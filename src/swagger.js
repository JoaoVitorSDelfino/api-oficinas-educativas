const swagger = require('swagger-autogen')()

output = './swagger_doc.json'
endpoints = ['./app.js']

const doc = {
    info: {
      version: '1.0',      
      title: 'API Oficinas Educativas',        
      description: 'Essa API é destinada para a criação de oficinas pedagógicas, tendo a possibilidade de criar, alterar e excluir oficinas, bem como definir participantes e organizadores desses eventos.'
    }
  }

swagger(output, endpoints, doc)