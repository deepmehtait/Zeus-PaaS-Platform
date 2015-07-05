var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userPorts= new Schema({
	defaultPort:Number
});
module.exports = mongoose.model('userPorts',userPorts, 'userPorts');

/**
 * New node file
 */