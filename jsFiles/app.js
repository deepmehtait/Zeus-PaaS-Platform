//Deep - Test of ajax and other small functions
var express = require("express"),
app = express(),
cons = require("consolidate");

// Must have in each app of node js for ajax calling 
app.use(express.bodyParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
	next();
});

app.engine('html', cons.swig);
app.set('view engine','html');
app.set('views', __dirname+'/views');

// handle default request
app.get('/',function (req,res){
		res.render("try");
});
// handle other requests and show error message
app.get('*',function(req,res){
		res.send("four OH four! Page Not Found");
});

// handle post request from user
app.post('/endpoint', function(req, res){
	var userid= req.body.userId;	
	console.log("some activity"+userid);
	var jsonobj = new Object();
	jsonobj.any="thing";
	jsonobj.userID=userid;
	//res.setHeader('Content-Type', 'application/json'); 
	res.send({any:userid, some:jsonobj});
});
app.get('/endpoint',function(req,res){
	consloe.log("get called");
	res.send({any:"got"});
});
// app running port
app.listen(3006);
console.log("Express Server was started at port 3006");
