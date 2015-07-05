var express = require('express');
var router = express.Router();
var fs = require('fs');
var repo_list;
var users = require("./models/zeus.js");
var sys = require('sys');
var execute = require('child_process').exec;

/* GET home page. */

module.exports = {
indexPage : function(req,res){
	res.render('index', { title: 'Zeus'});
	
}};
		
		

//POST to login page
router.post('/login', function(req,res) {
	
	users.findOne({username:req.body.username, password:req.body.password},function(err,user){
			if(err)
				res.send(err)
			if(user == null)
			  res.render('index', { title: 'Zeus' });
			else
			{
				repo_list = fs.readdirSync("./user_repositories/"+user.username+"/", function (error, list){
					return list;
				});
				req.session.username = req.body.username;
				res.render('login', {title: 'Zeus', name: user.username , repository_list : repo_list });			
			}
		});
});
/**
Test
router.post('/deep',function(req,res){
	console.log(req.body.username);
	//res.setHeader("Content-type","application/json");
	res.json({deep : 'this is it'});
});

router.get('/deep',function(req,res){

	res.send('this is it');
});
*/

//GET to login page
router.get('/login', function(req,res){
	var username = req.session.username;
	repo_list = fs.readdirSync("./user_repositories/"+username+"/", function (error, list){
					return list;
	});
	res.render('login', {title: 'Zeus', name: username , repository_list : repo_list });
});

//to display a particular repository
router.get('/repository/:repo', function(req,res){
	var username = req.session.username;
	
	repo_list = fs.readdirSync("./user_repositories/"+ username +"/" + req.params.repo , function(error,list){
		return list;
	});
	console.log(repo_list);
	res.render('repository', {title : 'Zeus' , username : username , repository_name : req.params.repo ,
								folder_structure : repo_list, file_selected : "" , file_content : " "});
});

//reroute to create repository page
router.get('/createRepo', function(req, res){
	res.render('createRepo',{title : "Zeus"})
});

//to submit the new repository information to be created
router.get('/submit_repo_info', function(req,res){
	var username = req.session.username;
//	console.log(req.param('repo_name'));
	function puts(error, stdout, stderr) { console.log(stdout); }
	execute("cd user_repositories/"+username+" && express "+ req.param('repo_name') +" -ejs", puts);
//res.set({"username":username});
	res.redirect('/login');
});

//request to open a repository file
router.get('/repository/:repo/:file_name',function(req,res){
	var username = req.session.username;
	var content = fs.readFileSync('./user_repositories/'+username+'/'+req.params.repo+"/"+req.params.file_name,
	 								'utf8', function (err,data) {
  	if (err) {
    	return console.log(err);
  	}
  	return data;
	});
	
	res.render('repository', {title : 'Zeus' , username : username , repository_name : req.params.repo ,
								folder_structure : repo_list, file_selected : req.params.file_name,
								file_content : content});
});

//Save a repository file
router.post('/repository/:repo/:file_name/submit_file',function(req,res){
	//console.log(req.body.content);
	var username = req.session.username;
	console.log('./user_repositories/'+username+"/"+req.params.repo+"/"+req.params.file_name);
	fs.writeFileSync("./user_repositories/"+username+"/"+req.params.repo+"/"+req.params.file_name,req.body.content,
						 'utf8');

	res.redirect('/repository/'+req.params.repo+'/'+req.params.file_name);
});

//Add a New User
router.get('/add_new_user', function(req,res){
	var ullas = new users({
			username : 'ullas',
			password : 'ullas'
});
	ullas.save(function(err,data){
		if
		 (err) console.log(err);
		else
		 console.log('Saved : ', data );
	});
});
