const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    tel: { type: String, required: false, default: '' },
    createDate: { type: Date, default: Date.now }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {

    constructor(body){
        this.body = body;
        this.errors = [];
        this.contato = null;
    }
    
    static async findByID(id) {
        const cont = ContatoModel.findById(id);
        return cont;
    }

    async register(){
        this.validate();
        if(this.errors.length > 0) return

        try {
            this.contato = await ContatoModel.create(this.body)
        } catch (e) {
            console.log(e);
            return res.render('404Error');
        }
        
    }
    
    validate(){
        this.cleanUp();
        if(!this.body.nome)
            this.errors.push('Nome é um campo obrigatório');

        if(this.body.email && !validator.isEmail(this.body.email)) 
            this.errors.push('Email inválido');

        if(!this.body.email && !this.body.tel)
            this.errors.push('Registre ao menos uma forma de contato');    
    }

    cleanUp(){
        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            tel: this.body.telefone
        }
    };

    async edit(id){
        this.validate();
        if(this.errors.length > 0) return;
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
    }

    static async delete(id){
        const contato = await ContatoModel.findOneAndRemove({_id: id});
        return contato;
    }

    static async listaContato() {
        const contatos = await ContatoModel.find().sort({ createDate: -1 });
        return contatos;
    }
}

module.exports = Contato;
