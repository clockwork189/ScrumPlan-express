exports.index = function(req, res){
    res.render('homepage/index.ejs', { title: 'ScrumPlan', layout: 'homepage/layout' });
};

exports.login = function(req, res){
    res.render('login/index.ejs', { title: 'ScrumPlan: Login', layout: 'login/layout' });
};
exports.register = function(req, res){
    res.render('login/register.ejs', { title: 'ScrumPlan: Register a new account', layout: 'login/layout' });
};