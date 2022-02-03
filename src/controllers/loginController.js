const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    res.render('login'); 
}

exports.register = async (req, res, next) => {
    try {
        const login = new Login(req.body);
        await login.register();
    
        if(login.errors.length > 0){
            req.flash('errors', login.errors);
            req.session.save( () => {
                return res.redirect('back'); 
            })
            return
        } else {
            req.flash('success', 'Seu cadsatro foi realizado com sucesso');
            req.session.save( () => {
                return res.redirect('back'); 
            })
            return   
        }
    } catch (e) {
        console.log(e);
        return res.render('404');
    }

}

exports.login = async (req, res, next) => {
    try {
        const login = new Login(req.body);
        await login.login();
    
        if(login.errors.length > 0){
            req.flash('errors', login.errors);
            req.session.save( () => {
                return res.redirect('/login'); 
            })
            return
        } else {
            req.session.user = login.user;
            req.flash('success', 'Seu login foi realizado com sucesso');
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

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}
