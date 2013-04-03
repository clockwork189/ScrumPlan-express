var User = require("./../models/User.js");
var hash = require('./../library/Password').hash;
var Project = require("./../models/Project.js");
var Task = require("./../models/Task.js");
var Organization = require("./../models/Organization.js");
var md5 = require("MD5");

exports.auth = function(req, res){
	authenticate(req.body.email, req.body.password, function(err, user){
		if (user) {
			req.session.regenerate(function() {
				req.session.user = user;
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

	hash(password, function(err, salt, hash){
		if (err) throw err;
		var newUser = {
			first_name: first_name,
			last_name: last_name,
			email: email,
			salt: salt,
			hash: hash
		};
		User.addUser(newUser, function(err, user) {
			req.session.regenerate(function() {
				req.session.user = user[0];
				res.redirect('app/dashboard');
			});
		});
	});
};

exports.add = function(req, res) {
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var organization_name = req.session.organization_name;

	User.findByEmail(email, function(err, user) {
		if(user) {
			Organization.addUserToOrganization(user.email, req.session.org_id, function() {
				res.redirect("/app/manage/users");
			});
		}
	});
};

exports.dashboard = function(req, res){
	var current_user = req.session.user;
	Organization.findByOwnersId(current_user._id, function(err, organizations) {
		Project.findByOwnersId(current_user._id, function(err, projects) {
			Task.findByOwnersId(current_user._id, function(err, tasks) {
				var email = current_user.email.toLowerCase().replace(/ /g,'');
				current_user.md5Email = md5(email);

				res.render('user/dashboard/index.html', {
					title: 'ScrumPlan: User Dashboard',
					user: current_user,
					projects: projects,
					organizations: organizations,
					tasks: tasks
				});
			});
		});
	});
};

exports.manage_users = function(req, res){
	res.render('user/manage/users.html', { title: 'ScrumPlan: Manage Users'});
};

exports.manage_projects = function(req, res){
	var project_id = req.params.projectid;

	Project.findById(project_id, function(err, project) {
		Task.findByProjectId(project_id, function(err, tasks) {
			res.render('user/manage/projects.html', { title: 'ScrumPlan: Manage Tasks', project: project, tasks: tasks });
		});
	});
};

exports.board = function(req, res){
	var user = req.session.user;
	Project.findByOwnersId(user._id, function(err, projects) {
		//User.findAllInOrganization(organization_name, function(err, users) {
			Task.findByOwnersId(user._id, function(err, tasks) {
				res.render('user/board/index.html', {
					title: 'ScrumPlan: Manage Tasks',
					projects: projects,
					tasks: tasks
				});
		//	});
		});
	});
};

exports.organization_board = function(req, res){
	var organization_id = req.params.organizationid;
	Project.findByOrganizationId(organization_id, function(err, projects) {
		//User.findAllInOrganization(organization_name, function(err, users) {
			//Task.findByOwnersId(user._id, function(err, tasks) {
				res.render('user/board/index.html', {
					title: 'ScrumPlan: Manage Tasks',
					projects: projects,
					tasks: tasks
				});
		//	});
		//});
	});
};

exports.stats = function(req, res){
	var organization_name = req.session.organization_name;
	Project.findAllInOrganization(organization_name, function(err, projects) {
		User.findAllInOrganization(organization_name, function(err, users) {
			Task.findAllInOrganization(organization_name, function(err, tasks) {
				res.render('user/stats/index.html', { title: 'ScrumPlan: User Stats', projects: projects, users: users, tasks: tasks, organization_name: organization_name });
			});
		});
	});
};

exports.logout = function(req, res){
	req.session.destroy(function(){
		res.redirect('/');
	});
};

exports.getProjectsUsersTasks = function(organization_name){
	Project.findAllInOrganization(organization_name, function(err, projects) {
		User.findAllInOrganization(organization_name, function(err, users) {
			Task.findAllInOrganization(organization_name, function(err, tasks) {
				return {projects: projects, users: users, tasks: tasks};
			});
		});
	});
};

function authenticate(email, pass, fn) {
	if (!module.parent) console.log('authenticating %s:%s', email, pass);
	User.findByEmail(email, function(err, user) {
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