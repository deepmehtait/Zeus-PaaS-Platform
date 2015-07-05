var express = require('express');
var router = express.Router();

var users = require('./models/zeusModel.js');
var userPorts = require('./models/userPorts.js');
var mongoose = require('mongoose');
var childprocess = require('child_process');
var spawn = require('child_process').spawn;
var zones = require('./createdomain.js');
var winston = require('winston');
var fs = require('fs');
var finder = require('findit');

var readWriteFile = require("./readWriteJson.js");

var dir = require("node-dir");
// var readDirectories = require ("./listFilesAndDirectories.js")

mongoose.connect(
		'mongodb://username:password@dbname.mongolab.com:dbport/collection',
		function(error) {
			if (error) {
				console.log("Unable to connect to database " + error);
			}
		});

// Render the home page.
router.get('/', function(req, res) {
	res.render('index', {
		title : 'Home',
		user : req.user
	});
});

// Render the registration page.
router.get('/register', function(req, res) {
	res.render('register', {
		title : 'Register',
		message : req.flash('error')[0]
	});
});


router.get('/:username/createNewApplication', function(req,res){
	res.render('createNewApplication',{username:req.session.username});	

});


// Register a new User using MongoLab
router.post('/register', function(req, res) {

	if (!req.body.username) {
		return res.render('register', {
			title : 'Register',
			message : 'Username required.'
		});
	}

	if (!req.body.password) {
		return res.render('register', {
			title : 'Register',
			message : 'Password required.'
		});
	}

	if (!req.body.email) {
		return res.render('register', {
			title : 'Register',
			message : 'Email required.'
		});
	}

	// check for username uniquesness
	users.count({
		"username" : req.body.username
	}, function(err, data) {
		if (data >= 1) {
			return res.render('register', {
				title : 'Register',
				message : 'This Username is taken'
			});
		} else {
			var user = new users({
				username : req.body.username,
				password : req.body.password,
				email : req.body.email,
				userApps : []
			});

  	//check for username uniquesness
  	users.count({"username" : req.body.username },function(err, data){
  		if(data >= 1){
  			return res.render('register', {title : 'Register', message: 'This Username is taken'});	
  		} else{
  			var cmd = "sudo mkdir ~/userApps/" + req.body.username;
			
			var ls = childprocess.exec(cmd, function(error, stdout, stderr) {
				if (error) {
					console.log(error.stack);
					console.log('Error code: ' + error.code);
					console.log('Signal received: ' + error.signal);
					responseLog = "Error code " + error.code + "Signal received: "
							+ error.signal;

				}
				/////////////////////////////////////////////////////////
				var user = new users({
	  				username 	: req.body.username,
	  				password 	: req.body.password,
	  				email 		: req.body.email,
	  				userApps	: []
	  			});

	  		  	user.save(function (err, data){
	  				if(err)
	  				 {console.log(err);
	  				 res.render('register');
	  				 }
	  				else
	  				 {console.log('Saved : ', data );
	  				 req.session.username=req.body.username;
	  				 req.session.email=req.body.email;
	  				 
	  				res.render('dashboard',{userapp:"", number_of_apps:0, username:req.session.username});
	  				 }
	  			});
				
			});

			ls.on('exit', function(code) {
				
				console.log('Child process exited with exit code ' + code);
				users.find({username:req.body.username},function(err,docs){
					var apps=docs;
					console.log("its correct dude.");
					res.render('dashboard',{userapp:"", number_of_apps:0, username:req.session.username});	
				});
			});
	
  		}
	
  	}); 

}

});

});

// Render the login page.
router.get('/login', function(req, res) {
	res.render('login', {
		title : 'Login',
		error : req.flash('error')[0]
	});
});

// Logout the user, then redirect to the home page

// Authenticate a user.

router.post(
  '/login', function(req,res){
	  	users.findOne({username:req.body.username, password:req.body.password},function(err,user){
			if(err)
				res.send(err)
			if(user == null)
				res.render('login',{title:'error',message:'Check your Username and password'})
			else if(user != null)
			{
				req.session.username = req.body.username;
				req.session.password =req.body.password;
			     
				res.redirect(req.session.username+'/dashboard');
			}
		});
});	  



router.get('/:username/dashboard', function (req, res) {
	console.log(req.param('username'));
	users.find({username:req.session.username},function(err,docs){
		var apps=docs;
		var user_app = docs[0].userApps;
		console.log("My Apps: "+user_app);
		res.render('dashboard',{userapp:user_app, number_of_apps:user_app.length, username:req.session.username});
	});
});


router.get('/editor/:appName', function(req,res){
	
	res.render('editor',{username:req.session.username, appName: req.param("appName")});
});


/*router.get('/createNewApp',function(req, res){
var ls = childprocess.exec('ls', function(error, stdout, stderr) {
		if (error) {
			console.log(error.stack);
			console.log('Error code: ' + error.code);
			console.log('Signal received: ' + error.signal);
			responseLog = "Error code " + error.code + "Signal received: "
					+ error.signal;
		}
	});
});

router.get('/:username/dashboard', function(req, res) {
	console.log(req.param('username'));
	users.find({
		username : req.session.username
	}, function(err, docs) {
		var apps = docs;
		var user_app = docs[0].userApps;
		console.log("My Apps: " + user_app);
		res.render('dashboard', {
			userapp : user_app,
			number_of_apps : user_app.length,
			username : req.session.username
		});
	});
});

router.get('/:username/createNewApplication', function(req, res) {
	console.log(req.param('username'));
	res.render('createNewApplication', {
		username : req.session.username
	});
});

router.get('/editor/:appName', function(req, res) {

	res.render('editor', {
		username : req.session.username,
		appName : req.param("appName")
	});
});

/*
 * router.get('/createNewApp',function(req, res){ var ls =
 * childprocess.exec('ls', function(error, stdout, stderr) { if (error) {
 * console.log(error.stack); console.log('Error code: ' + error.code);
 * console.log('Signal received: ' + error.signal); responseLog = "Error code " +
 * error.code + "Signal received: " + error.signal;
 *  } console.log('Child Process STDOUT: ' + stdout); //fs.writeFile('./'+
 * createNewAppLogName + '-out.log',stdout, function (err) {}); createNewAppInfo =
 * stdout; createNewAppError = stderr; console.log('Child Process STDERR: ' +
 * stderr); //fs.writeFile('./'+ createNewAppLogName + '-err.log',stderr,
 * function (err) {}); responseLog = "stdout: " + stdout + "stderr : " + stderr;
 * //res.render('dashboard'); });
 * 
 * console.log("LS PID 2: " + ls.pid);
 * 
 * ls.on('close', function(code) { console.log("LS PID 3: " + this.pid);
 * fs.writeFile('./'+ this.pid + '-out.log',createNewAppInfo, function (err)
 * {}); fs.writeFile('./'+ this.pid + '-err.log',createNewAppError, function
 * (err) {}); createNewAppError = '' createNewAppInfo = ''; console.log('Child
 * process exited with exit code ' + code); res.render('dashboard'); });
 * 
 * });
 */

var createNewAppInfo = '';
var createNewAppError = '';
router.post('/:username/createNewApp',function(req, res){
	var domain_name = req.body.domainName;
	var userId = req.param('username');
	var appName = req.body.appName;
	// Arguments needs to be changed according to AWS dns settings
	var args = {
		zoneId : "zoneID from Route53",
		name : domain_name + '.ruchandani.me',
		type : "A",
		ttl : 700,
		values : [ '54.183.142.127' ]
	};

	console.log("Creating new domain");
	zones.createDomain(args);

	
	///Write Domain and Port to JSON file
	//var trialPort = 3011
	
////
	userPorts.findOne({},function(err,docs){
		console.log("DEFAULT PORT "+docs.defaultPort);
		var defaultPort = docs.defaultPort;
		var new_port=docs.defaultPort+1;
		var new_application = {
				appName :appName,
				appLocation:"/userApps/" + userId + "/" + appName,
				appDomain:domain_name+".ruchandani.me",
				appPort :docs.defaultPort+1,
				appPID:1111,
				status:"stopped"
				};
		users.update({username: userId},{$push: {userApps:new_application}},{upsert:true},function(err){
	        if(err){
	                console.log(err);
	        }else
	        	{
	        	console.log("Successfully added");
	        	userPorts.update({ defaultPort: defaultPort },{$inc : {defaultPort:1} }, {upsert : true}, function (err, doc){
	  			  if(err)
	      			console.log(err);
	    			else
	      			{
	    				console.log("Incremented");
	    				console.log("creating app:" + appName);
	    				var cmd1 = "sudo mkdir ~/userApps/" + userId + "/" + appName;
	    				var cmd2 = ' && sudo cp -rf default_express_js/* ~/userApps/' + userId
	    						+ "/" + appName + "/";
	    				var cmd3 = " && cd ~/userApps/" + userId + "/" + appName
	    						+ " && sudo npm install ";
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
	    					createNewAppInfo = stdout;
	    					createNewAppError = stderr;
	    					responseLog = "stdout: " + stdout + "stderr : " + stderr;
	    					/////////////////////////////////////////////////////////
	    					users.find({username:userId},function(err,docs){
	    						var apps=docs;
	    						var user_app = docs[0].userApps;
	    						console.log("My Apps: "+user_app);
	    						res.render('dashboard',{userapp:user_app, number_of_apps:user_app.length, username:req.session.username});	
	    					});
	    					
	    				});

	    				ls.on('exit', function(code) {
	    					
	    					console.log('Child process exited with exit code ' + code);
	    					users.find({username:userId},function(err,docs){
	    						var apps=docs;
	    						var user_app = docs[0].userApps;
	    						console.log("its correct dude.");
	    						res.render('dashboard',{userapp:user_app, number_of_apps:user_app.length, username:req.session.username});	
	    					});
	    				});
	      			}
	  			  
	        	});
	        
	        }
		});
	});

	// res.render('index',{message: "initialized the app: " + appName + " on
	// port:" + ports-1,title: "express"});

});

router.get('/:username/gitFork', function(req, res) {
	console.log(req.param('username'));
	res.render('gitFork', {
		username : req.session.username
	});
});

router.post('/gitFork', function(req, res) {

	var userId = req.session.username;
	var domain_name = req.body.domainName;
	var appName = req.body.appName;
	var githubUrl = req.body.githubUrl;
	console.log(githubUrl);
	// Arguments needs to be changed according to AWS dns settings
	var args = {
		zoneId : "Z2WHLIJ6XNK5AG",
		name : domain_name + '.ruchandani.me',
		type : "A",
		ttl : 700,
		values : [ '54.183.142.127' ]
	};

	console.log("Creating new domain");
	zones.createDomain(args);

	// /Write Domain and Port to JSON file
//	var trialPort = 3011
//	var trialMapping = ',' + '\"' + domain_name + '.ruchandani.me' + '\"' + ":"
//			+ '\"' + trialPort + '\"' + "}"
//	readWriteFile.writeMapping(trialMapping);
	// //

	userPorts.findOne({}, function(err, docs) {
		console.log("DEFAULT PORT " + docs.defaultPort);
		var defaultPort = docs.defaultPort;
		var new_port= docs.defaultPort+1;
		var new_application = {
	appName :appName,
				appLocation:"/userApps/" + userId + "/" + appName,
				appDomain:domain_name+".ruchandani.me",
				appPort :docs.defaultPort+1,
				appPID:1111,
				status:"running"
				};
		users.update({username: userId},{$push: {userApps:new_application}},{upsert:true},function(err){
	        if(err){
	                console.log(err);
	        }else{
	        	var trialMapping = ',' + '\"' + domain_name + '.ruchandani.me' + '\"' + ":"
				+ '\"' + new_port + '\"' + "}"
		readWriteFile.writeMapping(trialMapping);
	                console.log("Successfully added");
	        }
		});

		userPorts.update({
			defaultPort : defaultPort
		}, {
			$inc : {
				defaultPort : 1
			}
		}, {
			upsert : true
		}, function(err, doc) {
			if (err)
				console.log(err);
			else
				console.log("Incremented");
			// doc.save();
		});

	});
	console.log("creating app:" + appName);

	var cmd2 = 'cd ~/userApps/' + userId;
	var cmd3 = " && sudo git clone " + githubUrl + " " + appName + " && cd "
			+ appName + " && sudo npm install ";
	var cmd = cmd2 + cmd3;
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
		res.redirect('/dashboard');
	});
});

router.get('/checkDomainName', function(req, res) {
	var domainName = req.query.domainName;
	// console.log("domainName : " + domainName);
	users.count({
		"appSchema.appDomain" : domainName
	}, function(err, data) {
		if (err) {
			res.render(err);
		}
		// console.log("data : " + data);
		if (data == 0) {
			res.send({
				success : 1
			});
		} else {
			res.send({
				success : 0
			});
		}
	});
});

router.post('/listFilesAndDirectories/:appName', function(req, res) {

	// list sub directories
	var appPath = req.body.appName;
	var userName = req.session.username;
	var currentPath = "/home/sagar/userApps/"+req.session.username+ "/"+req.param('appName');
	var result = [];
	var i =0, j = 0;
	//console.log("appLocation " + appLocation);
	var traverseFileSystem = function (currentPath) {
	    console.log(currentPath);
	    var files = fs.readdirSync(currentPath);
	    for (var i in files) {
	       var currentFile = currentPath + '/' + files[i];
	       var stats = fs.statSync(currentFile);
	       if (stats.isFile()) {
	    	   result.push({f : currentFile});
	       console.log("file " + currentFile);
	       }
	      else if (stats.isDirectory()) {
	    	  		result.push({d:currentFile});
	             traverseFileSystem(currentFile);
	             console.log("directory" + currentFile);
	           }
	     }
	   };
	   traverseFileSystem(currentPath);
	res.json(result);
});

router.get('/:username/settings', function(req, res) {

	users.find({
		username : req.session.username
	}, function(err, docs) {
		var apps = docs;
		var user_app = docs[0].userApps;
		console.log("My Apps: " + user_app);
		res.render('settings', {
			userapp : user_app,
			number_of_apps : user_app.length,
			username : req.session.username
		});
	});
});

router.get('/:username/deleteApp/:appName', function(req, res) {
	console.log(req.param('username'));
	var port=0;
	users.find({username: req.param('username')},function(err,docs){
		var user_app = docs[0].userApps;
		console.log("My Apps: "+user_app);
		for(var i=0;i<user_app.length;i++){
			if(user_app[i].appName==req.param('appName')){
				port = user_app[i].appPort;
				console.log("found port to be deleted> "+port);
			}
		}
		users.update({username: req.param('username')}, {$pull: {userApps: {appName: req.param('appName')}}}, { safe: true },function removeConnectionsCB(err, obj)
		{
		
			users.find({username:req.param('username')},function(err,docs){
        		var apps=docs;
        		var user_app = docs[0].userApps;
        		console.log("My Apps: "+user_app);
        		var cmd = "sudo rm -rf ~/userApps/" + req.param('username') + "/" + req.param('appName');
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
    				createNewAppInfo = stdout;
    				createNewAppError = stderr;
    				responseLog = "stdout: " + stdout + "stderr : " + stderr;
    				
    				var trialDelete =","+ '\"'+ req.param('appName') + '.ruchandani.me\"' + ":" + '\"'+port+'\"';
            		readWriteFile.deleteMapping(trialDelete);
            		users.find({username:req.session.username},function(err,docs){
            			var apps=docs;
            			var user_app = docs[0].userApps;
            			console.log("My Apps: "+user_app);
            			res.render('settings',{userapp:user_app, number_of_apps:user_app.length, username:req.session.username});	
            		});

    			});

        		
        		
    			ls.on('exit', function(code) {
    				createNewAppError = ''
    			    createNewAppInfo = '';
    				console.log('Child process exited with exit code ' + code);
    				users.find({username:req.session.username},function(err,docs){
            			var apps=docs;
            			var user_app = docs[0].userApps;
            			console.log("My Apps: "+user_app);
            			res.render('dashboard',{userapp:user_app, number_of_apps:user_app.length, username:req.session.username});	
            		});
    			});
    				
				});			
				
			
		});	
		
		
	});

});

//To start an applicatio
router.get('/:username/startApp/:appName', function(req, res) {
	var port=0;
	var pid=0;
	var appLocation="";
	var domainName="";
	var userId = req.param('username');
	var appName = req.param('appName');
	var response_log = "";
	
	users.find({username: req.param('username')},function(err,docs){
		var user_app = docs[0].userApps;
		console.log("My Apps: "+user_app);
		for(var i=0;i<user_app.length;i++){
			if(user_app[i].appName==req.param('appName')){
				port = user_app[i].appPort;
				pid=user_app[i].appPID;
				appLocation=user_app[i].appLocation;
				domainName=user_app[i].appDomain;
				console.log("found port to be started> "+port);
			}
		}
		var opts = {
				cwd : "/home/ubuntu/userApps/" + userId + "/" + appName,
				env : process.env
			}
		opts.env["PORT"] = port;
		var spawn_ls = spawn("nodemon", [ "./app.js" ], opts);

		var pid_original = spawn_ls.pid;

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
		
		var new_application = {
				appName :req.param('appName'),
				appLocation:appLocation,
				appDomain:domainName,
				appPort :port,
				appPID:pid_original,
				status:"running"
				};
		users.update({username: req.param('username')}, {$pull: {userApps: {appName: req.param('appName')}}}, { safe: true },function removeConnectionsCB(err, obj)
		{ console.log("cp1");
			users.update({username: userId},{$push: {userApps:new_application}},{upsert:true},function(err){
				users.find({username:req.session.username},function(err,docs){
					console.log("cp2");
					var trialMapping = ',' + '\"'+ domainName+ '\"' + ":" + '\"'+port+'\"' +"}"
		        	readWriteFile.writeMapping(trialMapping);
					var user_app = docs[0].userApps;
					console.log("My Apps: "+user_app);
					res.render('dashboard',{userapp:user_app, number_of_apps:user_app.length, username:req.session.username});	
				});
			});
			
		
		});
		
	
	});	

});



//To STOP an applicatio
router.get('/:username/stopApp/:appName', function(req, res) {
	var port=0;
	var pid=0;
	var appLocation="";
	var domainName="";
	var userId = req.param('username');
	var appName = req.param('appName');
	var response_log = "";
	
	users.find({username: req.param('username')},function(err,docs){
		var user_app = docs[0].userApps;
		console.log("My Apps: "+user_app);
		for(var i=0;i<user_app.length;i++){
			if(user_app[i].appName==req.param('appName')){
				port = user_app[i].appPort;
				pid=user_app[i].appPID;
				appLocation=user_app[i].appLocation;
				domainName=user_app[i].appDomain;
				//console.log("found port to be stopped> "+port);
			}
		}
		
		
		var cmd = "sudo fuser -k -n tcp " + port;
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
			createNewAppInfo = stdout;
			createNewAppError = stderr;
			responseLog = "stdout: " + stdout + "stderr : " + stderr;
			/////////////////////////////////////////////////////////
			var new_application = {
					appName :req.param('appName'),
					appLocation:appLocation,
					appDomain:domainName,
					appPort :port,
					appPID:pid,
					status:"stopped"
					};
			users.update({username: req.param('username')}, {$pull: {userApps: {appName: req.param('appName')}}}, { safe: true },function removeConnectionsCB(err, obj)
			{
				users.update({username: userId},{$push: {userApps:new_application}},{upsert:true},function(err){
					users.find({username:req.session.username},function(err,docs){
						console.log(domainName+"...sagar....."+port);
						var trialDelete =","+ '\"'+ domainName + '\"' +":" + '\"'+port+'\"';
	            		readWriteFile.deleteMapping(trialDelete);
						console.log("HERE, Success");
						var user_app = docs[0].userApps;
						console.log("My Apps: "+user_app);
						res.render('dashboard',{userapp:user_app, number_of_apps:user_app.length, username:req.session.username});	
					});
				});
				
				
			});
			
		ls.on('exit', function(code) {
			
			console.log('Child process exited with exit code ' + code);
			users.find({username:userId},function(err,docs){
				var apps=docs;
				var user_app = docs[0].userApps;
				console.log("its correct dude.");
				res.render('dashboard',{userapp:user_app, number_of_apps:user_app.length, username:req.session.username});	
			});
		});	
	});
});
		
});	


router.post('/writeToFile',function(req,res){
	var filePath = req.body.filePath;
	var contents = req.body.contents;
	fs.writeFile(filePath, contents, function (err,data) {
		  if (err) {
		    return console.log(err);
		  }
		  console.log(data);
		});
});

router.get('/readFromFile/:fileDest?', function(req, res){
	var filePath = req.param('fileDest');
	//var file2 = req.body.fileDest;
	console.log("Link hit " + filePath );
var content = fs.readFileSync("/home/sagar/userApps/sagar2/app1/app2file2");
});

router.get('/logout', function(req, res){
	req.session.username = null;
	req.session.email= null;
	res.render('index');
});


module.exports = router;
