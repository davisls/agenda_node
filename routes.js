const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');
const { loginRequired } = require('./src/middlewares/middewares');

// REQ => São os dados passados pelo usuário na requisição;
// RES => É a resposta enviado ao usuário pela aplicação.
// req.params.(nome do parametro) || req.query['(nome do parametro)'];


//Rotas da Home (Index)
route.get('/', homeController.index);

//Rotas de Login e Registro
route.get('/login', loginController.index);
route.get('/login/logout', loginController.logout);
route.post('/login/login', loginController.login);
route.post('/login/register', loginController.register);

//Rotas de Contato
route.get('/contato', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/:id', loginRequired, contatoController.editContato);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;
