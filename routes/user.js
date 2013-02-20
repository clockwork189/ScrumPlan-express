var User = require("./../models/User.js");
var hash = require('./../library/Password').hash;
var Project = require("./../models/Project.js");
var Task = require("./../models/Task.js");
var Organization = require("./../models/Organization.js");

exports.auth = function(req, res){
    authenticate(req.body.email, req.body.password, function(err, user){
        if (user) {
            req.session.regenerate(function() {
                req.session.user = user;
                req.session.organization_name = user.organization_name;
                res.redirect('app/dashboard');
            });
        } else {
            req.session.error = 'Authentication failed, please check your username and password.';
            res.redirect('login');
        }
    });
};

exports.create = function(req, res){
    var user_salt, user_hash;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;
    var organization_name = req.body.organization_name;
    hash(password, function(err, salt, hash){
        if (err) throw err;
        user_salt = salt;
        user_hash = hash;
        User.addUser(first_name, last_name, email, organization_name, user_salt, user_hash, function(err, user) {
            Organization.addOrganization(organization_name, email, function(err, organization) {
                req.session.regenerate(function() {
                    req.session.user = user;
                    req.session.organization_name = organization.organization_owner_email;
                    res.redirect('app/dashboard');
                });
            });
        });
    });
};

exports.dashboard = function(req, res){
    console.log(req.session.organization_name);
    res.render('user/dashboard/index.ejs', { title: 'ScrumPlan: User Dashboard', layout: 'user/layout/layout' });
};

exports.manage_users = function(req, res){
    res.render('user/manage/users.ejs', { title: 'ScrumPlan: Manage Users', layout: 'user/layout/layout' });
};

exports.manage_projects_tasks = function(req, res){
    var organization_name = req.session.organization_name;
    Project.getProjectsByOrganization(organization_name, function(err, projects) {
        User.getUsersByOrganization(organization_name, function(err, users) {
            Task.getTasksByOrganization(organization_name, function(err, tasks) {
                console.log("Tasks: ", tasks);
                console.log("projects: ", projects);
                console.log("Users: ", users);
                res.render('user/manage/projects_tasks.ejs', { title: 'ScrumPlan: Manage Tasks', layout: 'user/layout/layout', projects: projects, users: users, tasks: tasks });
            });
        });
    });
};

exports.board = function(req, res){
    var organization_name = req.session.organization_name;
    Project.getProjectsByOrganization(organization_name, function(err, projects) {
        User.getUsersByOrganization(organization_name, function(err, users) {
            Task.getTasksByOrganization(organization_name, function(err, tasks) {
                console.log("Tasks: ", tasks);
                console.log("projects: ", projects);
                console.log("Users: ", users);
                res.render('user/board/index.ejs', { title: 'ScrumPlan: Manage Tasks', layout: 'user/layout/layout', projects: projects, users: users, tasks: tasks });
            });
        });
    });
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

function generatepass(){
    var keylist="abcdefghijklmnopqrstuvwxyz123456789";
    var pLength = 10;
    var temp='';
    for (var i = 0; i < plength; i++) {
        temp += keylist.charAt(Math.floor(Math.random()*keylist.length));
    }
    return temp;
}