
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	project = require('./routes/project'),
	task = require('./routes/task'),
	http = require('http'),
	expressLayouts = require("express-ejs-layouts"),
	mongoStore = require('connect-mongo')(express),
	db = require("./lib/db"),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
	path = require('path');

var app = express();

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

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.set('layout', 'layout'); // Setting default layout
	app.use(expressLayouts);
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
app.post('/login', user.auth);
app.get('/register', routes.register);
app.post('/register', user.create);
app.get('/app/dashboard', user.dashboard);
app.get('/app/manage/users', user.manage_users);
app.get('/app/manage/projects', user.manage_projects_tasks);
app.get('/app/board', user.board);
app.get('/app/stats', user.stats);
app.get('/app/list', user.list);
app.get('/app/logout', user.logout);
app.post('/create/project', project.create);
app.post('/create/task', task.create);
app.post('/set/task', task.setTask);

io.sockets.on("connection", function (socket) {
    socket.on("new_task", function (data) {
        
    });
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
