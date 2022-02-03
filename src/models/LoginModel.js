const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    senha: {type: String, required: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login(){

        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user){
            this.errors.push('Usuário não existe.'); 
            return
        }

        if(!bcrypt.compareSync(this.body.senha, this.user.senha)){
            this.errors.push('Senha inválida!'); 
            this.user = null;
            return
        } 
    }

    async register(){
        this.validate();
        await this.checkUser();

        if(this.errors.length > 0) return

        this.crypt();

        try {
            this.user = await LoginModel.create(this.body)
        } catch (e) {
            console.log(e);
            return res.render('404Error');
        }
        
    }
    
    validate(){
        this.cleanUp();
        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

        if(this.body.senha.length < 4 || this.body.senha.length > 32){
            this.errors.push('Senha inválida');
        }
    }

    cleanUp(){
        this.body = {
            email: this.body.email,
            senha: this.body.senha
        }
    };

    crypt() {
        const salt = bcrypt.genSaltSync();
        this.body.senha = bcrypt.hashSync(this.body.senha, salt);
    }

    async checkUser(){
        this.user = await LoginModel.findOne({ email: this.body.email });
        if(this.user) this.errors.push('Usuário já existe');
    }
    
}

module.exports = Login;
