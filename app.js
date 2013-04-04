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
	socket.on("req-load-dashboard-templates", function (data) {
		var templates = [];
		var template = {
			html: fs.readFileSync("./views/user/dashboard/organization.html", "utf8"),
			id: "organization-template"
		};
		templates.push(template);
		socket.emit("load-templates", templates);
	});

	socket.on("req-load-board-templates", function (data) {
		var templates = [];
		var template = {
			html: fs.readFileSync("./views/user/board/board.html", "utf8"),
			id: "board-template"
		};
		templates.push(template);
		socket.emit("load-templates", templates);
	});

	socket.on("request-reload-organizations", function (data) {
		organization.getAllUsersOrganizationsAndProjects(data.user, function(err, result) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Successfully received all organizations ", result);
				socket.emit("reload", result);
			}
		});
	});
	socket.on("create_organization", function (data) {
		organization.create(data, function (err, result) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Organization added Successfully");
				socket.emit("reload", result);
			}
		});
	});
	socket.on("remove_organization", function (data) {
		organization.remove(data, function (err, result) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Organization removed Successfully");
				socket.emit("reload", result);
			}
		});
	});
	socket.on("create_project", function (data) {
		project.create(data, function (err, result) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Project added successfully");
				socket.emit("reload", result);
			}
		});
	});
	socket.on("remove_project", function (data) {
		project.remove(data, function (err, result) {
			if(err) {
				console.log("***ERROR: ", err);
			} else {
				console.log("Project removed Successfully");
				socket.emit("reload", result);
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
