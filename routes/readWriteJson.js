/**
 * New node file
 */

//USAGE : 
//Read Port from the JSON file 
//var portMapping= readWriteFile.readMapping();

//Write Domain and Port to JSON file
//var trialDomain = "utsav"
//var trialPort = 3011
//var trialMapping = ',' + '\"'+ trialDomain + '\"' + ":" + '\"'+trialPort+'\"' +"}"
//readWriteFile.writeMapping(trialMapping);

//For delete from Mapping 
//var trialDelete =","+ '\"'+ trialDomain + '\"' + ":" + '\"'+trialPort+'\"';
//readWriteFile.deleteMapping(trialDelete)

var fs= require("fs");
var fileName = "./domainMapping.json";

module.exports={

readMapping: function(){
var data = fs.readFileSync(fileName, "utf8");
var portMapping = JSON.parse(data);
return portMapping;
},

writeMapping: function(domainMapping){
	fs.readFile(fileName, 'utf8', function (err,data) {
	if(err){
		
		return console.log("Error writing to a file: readWriteJson, 0x1234");
	}	
		var result = data.replace("}",domainMapping);
		fs.writeFile(fileName, result, function(){
		if(err) return console.log("Error writing to a file: readWriteJson,0x1235");
	});
	});
	
},

deleteMapping : function(domainMapping){
  fs.readFile(fileName, 'utf8', function (err,data) {
        if(err){

                return console.log("Error writing to a file: readWriteJson, 0x1234");
        }

var result = data.replace(domainMapping,"");

fs.writeFile(fileName, result,function(){
if(err) 
return console.log("Error writing to a file: readWriteJson,0x1237");
});

});
}


};

