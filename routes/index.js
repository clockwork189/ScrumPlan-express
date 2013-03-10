var cons = require('consolidate');

exports.index = function(req, res){
    res.render('homepage/index.html', { title: 'ScrumPlan' });
};

exports.login = function(req, res){
    res.render('login/index.html', { title: 'ScrumPlan: Login'});
};
exports.register = function(req, res){
    res.render('login/register.html', { title: 'ScrumPlan: Register a new account' });
};