const Contato = require('../models/ContatoModel');

exports.index = (req, res, next) => {
    res.render('contato', {
        contato: {}
    });
}

exports.register = async (req, res, next) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();
    
        if(contato.errors.length > 0){
            req.flash('errors', contato.errors);
            req.session.save( () => {
                return res.redirect('/contato'); 
            })
            return
        } else {
            req.flash('success', 'Seu contato foi cadastrado com sucesso');
            req.session.save( () => {
                return res.redirect('back'); 
            })
            return   
        }
    } catch (e) {
        console.log(e);
        return res.render('404Error');
    }

}

exports.editContato = async (req, res, next) => {
    if(!req.params.id) return res.render('404Error');
    const contato = await Contato.findByID(req.params.id);
    if(!contato) return res.render('404Error');

    res.render('contato', { contato });
}

exports.edit = async (req, res, next) => {
    try {
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
    
        if(contato.errors.length > 0){
            req.flash('errors', contato.errors);
            req.session.save( async () => {
                const cont = await Contato.findByID(req.params.id);
                return res.redirect(`${cont._id}`); 
            })
            return
        } else {
            req.flash('success', 'Seu contato foi editado com sucesso');
            req.session.save( () => {
                return res.redirect(`/`); 
            })
            return   
        }
    } catch (e) {
        console.log(e);
        return res.render('404Error');
    }
}

exports.delete = async (req, res, next) => {
    const contato = await Contato.delete(req.params.id);
    if(!contato) return res.render('404Error');

    req.flash('success', 'Seu contato foi excluido');
    req.session.save( () => {
        return res.redirect('back'); 
    })
}
