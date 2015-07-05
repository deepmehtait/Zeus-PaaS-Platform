var Route53 = require('nice-route53');

var r53 = new Route53({
accessKeyId :  "AWS_ACCESS_KEY",
secretAccessKey :"AWS_SECRET_KEY" 
});

module.exports = {
getZoneDetails: function(){
r53.zones(function(err, zones) {
if(err)
	{
	console.log("Error While getting Domain names ");
	}
});

},

createDomain : function(args){
r53.setRecord(args,function(err,res){

console.log(res);
});

}


};
