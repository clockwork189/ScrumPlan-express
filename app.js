
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	http = require('http'),
	expressLayouts = require("express-ejs-layouts"),
	path = require('path');

var app = express();

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
	app.use(express.session());
	app.use(app.router);
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
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Authenticate using our plain-object database of doom!
function authenticate(name, pass, fn) {
	if (!module.parent) console.log('authenticating %s:%s', name, pass);
	var user = users[name];
	// query the db for the given username
	if (!user) return fn(new Error('cannot find user'));
	// apply the same algorithm to the POSTed password, applying
	// the hash against the pass / salt, if there is a match we
	// found the user
	hash(pass, user.salt, function(err, hash) {
		if (err) return fn(err);
		if (hash == user.hash) return fn(null, user);
		fn(new Error('invalid password'));
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

app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', user.auth);
app.get('/register', routes.register);
app.post('/register', user.create);
app.get('/app/manage', user.manage);
app.get('/app/board', user.board);
app.get('/app/stats', user.stats);
app.get('/app/list', user.list);
app.get('/app/logout', user.logout);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
