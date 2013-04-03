
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	project = require('./routes/project'),
	organization = require('./routes/organization'),
	board = require('./routes/board'),
	task = require('./routes/task'),
	swig = require('swig'),
	http = require('http'),
	cons = require("consolidate"),
	mongoStore = require('connect-mongo')(express),
	db = require("./lib/db"),
	socket = require('socket.io'),
	fs = require('fs'),
	path = require('path');

var app = express();
var server = http.createServer(app);
var io = socket.listen(server, { log: false});

app.configure('development', function() {
  app.set('db-name', "ScrumPlan");
  app.use(express.errorHandler({ dumpExceptions: true }));
  app.set('view options', {
	pretty: true
  });
});

app.configure('production', function() {
  app.set('db-name', "ScrumPlan");
});

// This helps it know where to look for includes and parent templates
swig.init({
    root: __dirname + '/views',
    cache: false,
    filters: {
		jsonify: function (input) { return JSON.stringify(input); }
	},
    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
});

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.engine('html', cons.swig);
	app.set('view engine', 'html');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session({ store: new mongoStore({db: app.set('db-name')}), secret: 'topsecret' }));
	//app.use(express.session({secret: "shhh", store: new RedisStore}));
	app.use(express.static(path.join(__dirname, 'public')));
	// Session-persisted message middleware
	app.use(function(req, res, next){
		var err = req.session.error,
			msg = req.session.success;
		delete req.session.error;
		delete req.session.success;
		res.locals.message = '';
		if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
		if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
		next();
	});
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/register', routes.register);
app.get('/app/dashboard', user.dashboard);
app.get('/app/manage/users', user.manage_users);
app.get('/app/projects/:projectid', user.manage_projects);
app.get('/app/board', user.board);
app.get('/app/board/:organizationid', user.organization_board);
app.get('/app/stats', user.stats);
app.get('/app/logout', user.logout);

app.post('/login', user.auth);
app.post('/register', user.create);
app.post('/add/user', user.add);
app.post('/create/project', project.create);
app.post('/create/task', task.create);

io.sockets.on("connection", function (socket) {
	socket.on("add_task", function (data) {
		task.createTask(data, function (err, task) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Task added Successfully");
				var ProjectTaskUserObject = user.getProjectsUsersTasks(project.organization_name);
				socket.broadcast.emit("reload", ProjectTaskUserObject);
			}
		});
	});
	socket.on("add_project", function (data) {
		project.createProject(data, function (err, project) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Project added Successfully");
				var ProjectTaskUserObject = user.getProjectsUsersTasks(project.organization_name);
				socket.broadcast.emit("reload", ProjectTaskUserObject);
			}
		});
	});
	socket.on("request-reload-organizations", function (data) {
		organization.getAllUsersOrganizationsAndProjects(data.user, function(err, organizations) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("***Orgs:", organizations);
				var html = fs.readFileSync("./views/user/dashboard/organization.html", "utf8");
				var obj = {
					html: html,
					organizations: organizations
				};
				console.log("Successfully received all organizations ", organizations);
				socket.emit("reload-organizations", obj);
			}
		});
	});
	socket.on("create_organization", function (data) {
		organization.create(data, function (err, organizations) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				var html = fs.readFileSync("./views/user/dashboard/organization.html", "utf8");
				var obj = {
					html: html,
					organizations: organizations
				};
				console.log("Organization added Successfully");
				socket.emit("reload-organizations", obj);
			}
		});
	});
	socket.on("remove_organization", function (data) {
		organization.remove(data, function (err, organizations) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				var html = fs.readFileSync("./views/user/dashboard/organization.html", "utf8");
				var obj = {
					html: html,
					organizations: organizations
				};
				console.log("Organization added Successfully");
				socket.emit("reload-organizations", obj);
			}
		});
	});
	socket.on("create_project", function (data) {
		console.log("Create Project: ", data);
		project.create(data, function (err, organizations) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				var html = fs.readFileSync("./views/user/dashboard/organization.html", "utf8");
				var obj = {
					html: html,
					organizations: organizations
				};
				console.log("Project added successfully");
				socket.emit("reload-organizations", obj);
			}
		});
	});
	socket.on("remove_project", function (data) {
		project.remove(data, function (err, organizations) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				var html = fs.readFileSync("./views/user/dashboard/organization.html", "utf8");
				var obj = {
					html: html,
					organizations: organizations
				};
				console.log("Project removed Successfully");
				socket.emit("reload-organizations", obj);
			}
		});
	});

	socket.on("create_task", function (data) {
		console.log("Create Task: ", data);
		task.create(data, function (err, tasks) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Task added successfully");
			}
		});
	});
	socket.on("remove_task", function (data) {
		task.remove(data, function (err, tasks) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Task removed Successfully");
			}
		});
	});
});

server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
