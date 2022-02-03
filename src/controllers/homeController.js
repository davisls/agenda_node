const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    const contatos = await Contato.listaContato();
    res.render('index', { contatos }); 
};
