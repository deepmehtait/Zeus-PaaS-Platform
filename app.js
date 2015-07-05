//This file is responsible for 
//creating a new subdomain 
//creating new applications for a user 
//start an application 

//The Server will be running on port 3001 
//so if a user wants to create an app then he can make a request 

//http: ****.***:3001/createDomain/
//post eg. {"domainName":"user2"}

//http: ****.***:3001/createApp/
//post eg. {"userId":"user2", "appName":"app1"}

//http: ****.***:3001/startApp/
//post eg. {"userId":"user2", "appName":app1"}

/* Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var httpProxy = require('http-proxy');


var flash = require('connect-flash');
//var session = require('express-session');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');  

var mongoose = require('mongoose'); // mongoose for mongodb
//var expressSession = require('express-session'); // Sessions
var routes = require('./routes/index');
var users = require('./routes/users');
var zones = require('./routes/createdomain');

//var bodyParser = require('body-parser');
var session = require('cookie-session');

var cookieParser = require('cookie-parser');//new

var app = express();


// /Port 3000-3001 for Zeus's setup
var MainAppPort = 3001;
var storage = ""; // json storage for temporary purpose
var start_file = 'app.js';
var responseLog;
// Applications Port will be running after port 3010

// Configuration of Mongodb
// mongoose.connect('mongodb://localhost:27017/zeus');

// Configuration
app.use(cookieParser('notsosecretkey'));
app.use(session({secret: 'notsosecretkey123'}));


app.set('view engine', 'ejs');
app.set('port', process.env.PORT || MainAppPort);
app.set('views', path.join(__dirname, 'views'));

app.use(favicon());
app.use(logger('dev'));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({ secret: process.env.EXPRESS_SECRET, key: 'sid', cookie: {secure: false} }));
app.use(cookieParser());
//app.use(expressSession({secret:'somesecrettokenhere',resave: true, saveUninitialized: true}));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(flash());


app.use('/',routes);
/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//

/*http.createServer(app).listen(app.get('port'), function() {
	console.log('Main Express server listening on port ' + app.get('port'));
});*/






/*
app.get('/', function(req, res) {
	routes.indexPage(req, res);
});

//Display Register Page
app.get('/register', function(req, res) {
	routes.getregisterPage(req, res);
});

//Register a User
app.post('/register', function(req, res) {
	routes.registerUser(req, res);
});

//Display Login Page
app.get('/login', function(req, res) {
	routes.getLoginPage(req, res);
});

//Display Login Page
app.post('/login', function(req, res) {
	routes.postLogin(req, res);
});

//Go to DashBoard Page
app.get('/dashboard', function(req, res) {
	routes.getDashboardPage(req, res);

});*/
/*app.get('/index', function(req, res, next) {
	if (!path.extname(req.url)) {
		var ip = req.connection.remoteAddress || req.socket.remoteAddress;
		if (req.headers["x-real-ip"])
			ip = req.headers["x-real-ip"];
		var toEmit = {
			ip : ip,
			url : req.url,
			time : new Date(),
			method : req.method,
			host : req.headers.host,
		};
		console.log("Emitter: " + JSON.stringify(toEmit));
		// dash.emit('nodester::incomingRequest', toEmit);

	}
	res.render('index', {
		title : "express"
	});
});

// To create a new Sub-domain
// Utsav's code below
app.post('/createDomain', function(req, res) {
	var domain_name = req.body.domainName;
	// Arguments needs to be changed according to AWS dns settings
	var args = {
		zoneId : "Z2WHLIJ6XNK5AG",
		name : domain_name + '.utsavpopli.me',
		type : "A",
		ttl : 700,
		values : [ '54.183.142.127' ]
	};
	zones.createDomain(args);
	res.send("Domain created");
});

// To create a new app for the user
// Condition : Assuming User is already registered and the directory related to
// the user is already there
app.post("/createApp", function(req, res) {
	responseLog = "";

	var userId = req.body.userId;
	var appName = req.body.appName;
	console.log("creating app:" + appName);
	var cmd1 = "sudo mkdir ~/userApps/" + userId + "/" + appName;
	var cmd2 = ' && sudo cp -rf default_express_js/* ~/userApps/' + userId
			+ "/" + appName + "/";
	var cmd3 = " && cd ~/userApps/" + userId + "/" + appName
			+ " && npm install ";
	var cmd = cmd1 + cmd2 + cmd3;
	var ls = childprocess.exec(cmd, function(error, stdout, stderr) {
		if (error) {
			console.log(error.stack);
			console.log('Error code: ' + error.code);
			console.log('Signal received: ' + error.signal);
			responseLog = "Error code " + error.code + "Signal received: "
					+ error.signal;

		}
		console.log('Child Process STDOUT: ' + stdout);
		console.log('Child Process STDERR: ' + stderr);
		responseLog = "stdout: " + stdout + "stderr : " + stderr;

	});

	ls.on('exit', function(code) {
		console.log('Child process exited with exit code ' + code);
		res.send("some error occured.");
	});

	// res.render('index',{message: "initialized the app: " + appName + " on
	// port:" + ports-1,title: "express"});
});

// To start an application
app.post('/startApp', function(req, res) {

	var userId = req.body.userId;
	var appName = req.body.appName;
	var response_log = "";
	var opts = {
		cwd : "/home/ubuntu/userApps/" + userId + "/" + appName,
		env : process.env
	}

	opts.env["PORT"] = app_port;
	app_port++;
	var spawn_ls = spawn("nodemon", [ "./" + start_file ], opts);

	spawn_ls.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
		var output = 'processoutput=' + data;
		response_log = response_log + output;
	});

	spawn_ls.stderr.on('data', function(data) {
		console.log('stderr: ' + data);
		var output = 'processoutput=' + data;
		response_log = output;
	});

	spawn_ls.on('exit', function(code) {
		console.log("exited : " + code);
	});
	spawn_ls.stdout.on("close", function(code) {
		res.send(response_log);
		console.log("stdio finished: " + code);
	});
	console.log("collecting response: " + response_log);
	res.send(response_log);

});

// add test post api
app.post('/deeptest', function(req, res) {
	var userID = req.body.userId;
	var appName = req.body.appName;
	console.log("use id =" + userID + " appName=" + appName);

	res.send("hello");
});

app.post('/view_all_domains', function(req, res) {
	storage = storage.split(",");
	res.render('view_all_domains', {
		storage : storage
	});
	// res.send("All Domains:");
});*/

http.createServer(app).listen(app.get('port'), function() {
	console.log('Main Express server listening on port ' + app.get('port'));

});
