var express = require('express');
var router = express.Router();
var passport = require('passport');
var stormpath = require('stormpath');


// Render the home page.
module.exports = {
		
//Render Home Page
indexPage : function(req, res) {
  res.render('index', { title: 'Home', user: req.user });

}, 

//Render register Page
 getregisterPage : function(req, res) {
	 var username = req.body.username;
	  var password = req.body.password;

	  // Grab user fields.
	  if (!username || !password) {
	    return res.render('register', { title: 'Register', error: 'Email and password required.' });
	  }

	  // Initialize our Stormpath client.
	  var apiKey = new stormpath.ApiKey(
	    process.env['STORMPATH_API_KEY_ID'],
	    process.env['STORMPATH_API_KEY_SECRET']
	  );
	  var spClient = new stormpath.Client({ apiKey: apiKey });

	  // Grab our app, then attempt to create this user's account.
	  var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
	    if (err) throw err;

	    app.createAccount({
	      givenName: 'John',
	      surname: 'Smith',
	      username: username,
	      email: username,
	      password: password,
	    }, function (err, createdAccount) {
	      if (err) {
	        return res.render('register', {'title': 'Register', error: err.userMessage });
	      } else {
	        passport.authenticate('stormpath')(req, res, function () {
	          return res.redirect('/dashboard');
	        });
	      }
	    });

	  });

 },

 //When a user hit register Page, it sends a post message 
 registerUser:function(req,res){ 

var username = req.body.username;
 var password = req.body.password;

 // Grab user fields.
 if (!username || !password) {
   return res.render('register', { title: 'Register', error: 'Email and password required.' });
 }

 // Initialize our Stormpath client.
 var apiKey = new stormpath.ApiKey(
   process.env['STORMPATH_API_KEY_ID'],
   process.env['STORMPATH_API_KEY_SECRET']
 );
 var spClient = new stormpath.Client({ apiKey: apiKey });

 // Grab our app, then attempt to create this user's account.
 var app = spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
   if (err) throw err;

   app.createAccount({
     givenName: 'John',
     surname: 'Smith',
     username: username,
     email: username,
     password: password,
   }, function (err, createdAccount) {
     if (err) {
       return res.render('register', {'title': 'Register', error: err.userMessage });
     } else {
       passport.authenticate('stormpath')(req, res, function () {
         return res.redirect('/dashboard');
       });
     }
   });

 });

},

//Renders Login Page
getLoginPage: function(req, res) {
	  res.render('login', { title: 'Login', error: req.flash('error')[0] });
	},

//Renders Logout Page
getLogoutPage:function(req, res) {
	  req.logout();
	  res.redirect('/');
},

//Display Dashboard
getDashboardPage:  function (req, res) {
	  if (!req.user || req.user.status !== 'ENABLED') {
		    return res.redirect('/login');
		  }

		  res.render('dashboard', {
		    title: 'Dashboard',
		    user: req.user,
		    }
		  );
		},
postLogin: function(req,res){
	// Authenticate a user.
	  passport.authenticate(
	    'stormpath',
	    {
	      successRedirect: '/dashboard',
	      failureRedirect: '/login',
	      failureFlash: 'Invalid email or password.',
	    }
	  )
}


};

// Authenticate a user.
router.post(
  '/login',
  passport.authenticate(
    'stormpath',
    {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.',
    }
  )
);



