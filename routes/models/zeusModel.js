var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var appSchema = new Schema({
	appName :String,
	appLocation:String,
	appDomain:String,
	appPort :Number,
	appPID:Number,
	status:String,
	created_at:  {type: Date, default: Date.now}
	
});
var userSchema = new Schema({
	username:String,
	password:String,
	email :String,
	created_at: {type: Date, default: Date.now},
	userApps : [appSchema]

});


module.exports = mongoose.model('users',userSchema);



