var User = require("./../models/User.js");
var Task = require("./../models/Task.js");
var hash = require('./../library/Password').hash;

exports.auth = function(req, res){
    var username = req.body.email;
    var password = req.body.password;
    //res.render('login/index.ejs', { title: 'ScrumPlan: Login', layout: 'login/layout' });
};

exports.create = function(req, res){
    var user_salt, user_hash;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
    // when you create a user, generate a salt
    // and hash the password ('foobar' is the pass here)
    hash(password, function(err, salt, hash){
        if (err) throw err;
        user_salt = salt;
        user_hash = hash;
        User.addUser(first_name, last_name, email, user_salt, user_hash, function(err, user) {
            req.session.regenerate(function() {
                req.session.user = user;
            });
            res.redirect('app/manage');
        });
    });
};

exports.manage = function(req, res){
    res.render('user/manage/index.ejs', { title: 'ScrumPlan: User Dashboard', layout: 'user/layout/layout' });
};

exports.board = function(req, res){
    res.render('user/board/index.ejs', { title: 'ScrumPlan: Board', layout: 'user/layout/layout' });
};

exports.stats = function(req, res){
    res.render('user/stats/index.ejs', { title: 'ScrumPlan: User Stats', layout: 'user/layout/layout' });
};

exports.list = function(req, res){
    res.render('user/list/index.ejs', { title: 'ScrumPlan: User List', layout: 'user/layout/layout' });
};

exports.logout = function(req, res){
    res.render('user/list/index.ejs', { title: 'ScrumPlan: User List', layout: 'user/layout/layout' });
};