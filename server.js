/*Configura o dotenv (segurança/variaveis de ambiente)*/
require('dotenv').config(); 

/*Importando e instanciando o Express*/
const express = require('express');
const app = express();

/*Importando via desestrutração os middlewares da aplicação*/
const { csrfTokenError, csrfTokenMiddeware, localErrors, localSuccess } = require('./src/middlewares/middewares')

/*Importa o mongoose (comunicação com o MongoDB)*/
const mongoose = require('mongoose'); 
mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        /*Emite um sinal quando a conexão com o bd estiver efetuada*/
        app.emit('Base Conectada');
    })
    .catch( e => console.log('Ocorreu um erro ao conectar com o BD: '+ e));

/*Importações relacionadas a segurança da aplicação*/  
const helmet = require('helmet');
const csrf = require('csurf');

/*Importações referentes a session*/ 
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

/*Importação das rotas*/ 
const routes = require('./routes');

/*Definição dos caminhos das views e dos arquivos estáticos*/
const path = require('path');
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

/*Recebimento de POST's e JSON's*/
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*Definição das configurações de Sessão*/
const sessionOptions = session({
    secret: 'olameuchapa',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //Uma Semana*/
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

app.use(helmet());
app.use(csrf());

/*Middewares Próprios:*/
app.use(localErrors);
app.use(localSuccess);

/*Verifica se o token csrf existe e o cria nas variaveis locais*/
app.use(csrfTokenError); 
app.use(csrfTokenMiddeware);

app.use(routes);

/*Espera o Sinal emitido pelo mongoose quando o bd estiver conectado*/
app.on('Base Conectada', () => {
    app.listen(8080, function(e){
        if(e){
            console.log(e);
        } else {
            console.log('Servido rodando com sucesso.');
        }
    });
});
