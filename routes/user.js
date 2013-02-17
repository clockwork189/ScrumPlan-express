var User = require("./../models/User.js");
var Task = require("./../models/Task.js");
var hash = require('./../library/Password').hash;

exports.auth = function(req, res){
    authenticate(req.body.email, req.body.password, function(err, user){
        if (user) {
            // Regenerate session when signing in to prevent fixation
            req.session.regenerate(function(){
                // Store the user's primary key in the session store to be retrieved, or in this case the entire user object
                req.session.user = user;
                res.redirect('app/manage');
          });
        } else {
            req.session.error = 'Authentication failed, please check your username and password.';
            res.redirect('login');
        }
    });
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
    req.session.destroy(function(){
        res.redirect('/');
    });
};

// Authenticate using our plain-object database of doom!
function authenticate(email, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', email, pass);
    User.getUserByEmail(email, function(err, user) {
        if (!user) return fn(new Error('cannot find user'));
        hash(pass, user.salt, function(err, hash) {
            if (err) return fn(err);
            if (hash == user.hash) return fn(null, user);
            fn(new Error('invalid password'));
        });
    });
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}