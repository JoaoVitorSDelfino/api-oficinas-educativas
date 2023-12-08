<h1 align="center"> API Oficina Educativas </h1>

# Introdução
Essa API é destinada para a criação de oficinas pedagógicas, tendo a possibilidade de criar, alterar e excluir oficinas, bem como definir participantes e organizadores desses eventos.
## Ferramentas utilizadas
Para desenvolver essa API, foi utilizado a IDE Visual Studio Code para edição de código, e o Postman para realizar operações envolvendo as rotas.

# Funcionamento
## Banco de dados
Para o banco de dados, foi utilizado o SQLite para armazenar os dados, e o Sequelize.

A API possui 4 tabelas atuantes:
- Usuários: Pessoas que vão acessar o sistema
- Oficinas: Oficinas cadastradas por usuários
- Organizadores: Usuários capazes de editar e excluir oficinas que foram denominados como organizadores
- Participantes: Usuários que participaram das oficinas

Organizadores e participantes servem como tabelas intermediárias da relação muitos para muitos entre usuários e oficinas, aonde uma oficina pode ter diversos organizadores e participantes, ao mesmo tempo que usuários podem ser organizadores e participantes em muitas oficinas. As colunas para essas tabelas são as seguintes:

Oficina 
- id (INT)
- nome (STRING)
- descricao (STRING)
- data (STRING, padrão DD-MM-AAAA)
- local (STRING)

Usuário
- id (INT)
- funcao (STRING)
- nome (STRING)
- login (STRING, padrão UXXXX)
- senha (STRING, tamanho de 8 até 20)
- email (STRING, obrigatório @)

Organizador
- id (INT)
- idUsuario (INT, chave estrangeira de usuário)
- idOficina (INT, chave estrangeira de oficina)

Participante
- id (INT)
- idUsuario (INT, chave estrangeira de usuário)
- idOficina (INT, chave estrangeira de oficina)
- presente (INT, padrão 0 ou 1)
- nota (INT, padrão 0 até 10)

## Hierarquia
Usuários são divididos em 3 tipos com permissões diferentes.

- Aluno: Tem permissão para ser um participante e realizar algumas funções de busca.
- Professor: Tem permissão para criar oficinas e adicionar organizadores e participantes para as oficinas aonde ele é um organizador.
- Coordenador: Não possui restrições.

## JWT e login
Para realizar o login, é preciso acessar a rota POST /login, contendo um json no seguinte formato:

```c
{
  "login": "U0000",
  "senha": "usuarioExemplo"
}
```

Ao realizar login, será gerado um token contendo o id do usuário e a função. Para acessar as funções da API, é necessário de um token, que terá permissões de acordo com a função do usuário logado.
Há diversas rotas que alunos não podem acessar, mas professores e coordenadores podem, ao mesmo tempo que tem diversas rotas aonde professores não possuem permissão, mas coordenadores podem.
Após a instalação do sistema (/install), será criado um usuário coordenador (administrador). Para realizar o login como esse usuário, acesse utilizando as credenciais:

```c
{
  "login": "U0001",
  "senha": "123456789"
}
```
Após realizar o login, será retornado um JSON com o token assinado. Tokens possuem validade de 1 hora
```c
{
    "auth": true,
    "mensagem": "Login bem sucedido!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImNvb3JkZW5hZG9yIiwiaWF0IjoxNzAyMDY0MzE5LCJleHAiOjE3MDIwNjc5MTl9.8e0-ecI55TN0Re_GQ2-jPen_QpJG4NIYzuQgY789CCg"
}
```
Basta depois adicionar na seção headers da rota no Postman uma coluna com o nome de 'Authorization', e dentro do Value colocar o token gerado

<img width="948" alt="postmanToken" src="https://github.com/JoaoVitorSDelfino/api-oficinas-educativas/assets/103132209/0eed8c3e-2ec2-4f60-9793-9473a40ab04b">

## Rotas
Antes de acessar quaisquer rotas, é preciso usar a rota /install para instalar as informações iniciais e um usuário administrador, após isso, é só realizar o login na rota /login.
Por meio da rota /docs, é possível obter a documentação Swagger da API

### /protected
Rotas dentro dessa rota são acessadas apenas por meio de um token válido

#### /admin
Rota acessível apenas por usuários administradores (coordenadores)
##### /add-admin
Rota destinada a cadastrar novos coordenadores

#### /api
Rota destinada as principais operações envolvendo oficinas, usuários, organizadores e participantes. Todas as rotas contém operações CRUD como:
- GET /list/:limite/:pagina -> Listagem do banco de dados
- GET /view/:id -> Pequisa indivídual utilizando id
- POST /add -> Adicionar novos registros
- PUT /edit/:id -> Editar pelo id
- DELETE /delete/:id -> Deletar pelo id

Organizadores e participantes possuem as rotas a cima e as seguintes:
- DELETE /delete/:idUsuario/:idOficina -> Deletar organizador/participante pelo id do usuário e da oficina

Participantes possui duas rotas para edição:
- PUT /edit/:idUsuario/:idOficina -> Editar pelo id de usuário e oficina
- PUT /editById/:id -> Editar pelo id de participante

#### /operations
Rota dedicadas a operações envolvendo lógica de negócio, sendo elas a rota /ranking e /workedTogether

## JSONs para rotas de postagem
### /login
```c
{
    "login": "U0000",
    "senha": "senhaExemplo"
}
```
### /protected/admin/add-admin
```c
{
  "nome": "NomeExemplo",
  "senha": "senhaExemplo",
  "email": "emailExemplo@gmail.com"
}
```
### /protected/admin/add-admin
```c
{
  "nome": "NomeExemplo",
  "senha": "senhaExemplo",
  "email": "emailExemplo@gmail.com"
}
```
### /protected/api/oficina
```c
{
  "nome": "nomeExemplo",
  "descricao": "descriçãoExemplo",
  "data": "10-10-2020",
  "local": "localExemplo"
}
```
### /protected/api/usuario
```c
{
  "funcao": "aluno",
  "nome": "NomeExemplo",
  "senha": "senhaExemplo",
  "email": "emailExemplo@gmail.com"
}
```
### /protected/api/organizador
```c
{
  "idUsuario": 1,
  "idOficina": 1,
}
```

### /protected/api/participante
```c
{
  "idUsuario": 2,
  "idOficina": 2,
  "presente": 1,
  "nota": 10.0
}
```
## Operações e lógica de negócio
Dentro do rota API, ainda temos a rota /operations, que contém duas rotas envolvendo duas operações, sendo elas as rotas /ranking e /workedTogether

### GET /ranking
Essa rota retorna um ranking de todos organizadores de acordo com a quantidade de oficinas em que cada um já colaborou. Um exemplo de retorno dessa rota:
```c
{
    "status": true,
    "mensagem": "Sucesso ao obter ranking de organizadores!",
    "ranking": [
        {
            "nome": "Vanessa Five",
            "oficinasOrganizadas": 3
        },
        {
            "nome": "Rodrigo Fallen",
            "oficinasOrganizadas": 2
        },
        {
            "nome": "Margaret Lancaster",
            "oficinasOrganizadas": 2
        },
        {
            "nome": "José Matias",
            "oficinasOrganizadas": 1
        },
        {
            "nome": "William Indali",
            "oficinasOrganizadas": 1
        }
    ]
}
```
### GET /workedTogether/idUsuario
Essa rota retorna uma lista de todos os usuários que já trabalhou com o usuário informado por parâmetro (idUsuario), tendo também uma contagem da quantidade de vezes que já participaram de uma mesma oficina. Um exemplo de retorno dessa rota:
```c
{
    "status": true,
    "mensagem": "Sucesso em obter os dados!",
    "usuariosParticipantes": [
        {
            "usuario": 4,
            "oficinasJuntos": 1
        },
        {
            "usuario": 6,
            "oficinasJuntos": 3
        },
        {
            "usuario": 9,
            "oficinasJuntos": 2
        },
        {
            "usuario": 10,
            "oficinasJuntos": 1
        }
    ]
}
```