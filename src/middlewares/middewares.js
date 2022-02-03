exports.csrfTokenError = (err, req, res, next) => {
    if(err && err.code == 'EBADCSRFTOKEN'){
        return res.render('404Error');
    }
}

exports.csrfTokenMiddeware = (req, res, next) => { 
    res.locals.csrfToken = req.csrfToken();
    next();
}

exports.localErrors = (req, res, next) => { 
    res.locals.errors = req.flash('errors');
    next();
}

exports.localSuccess = (req, res, next) => { 
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}

exports.loginRequired = (req, res, next) => {
    if(!req.session.user){
        req.flash('errors', 'Você precisa estar logado para acessar esta página.')
        req.session.save(() => res.redirect('/'));
        return;
    }

    next();
}
