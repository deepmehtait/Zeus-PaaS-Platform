var cluster = require ('cluster'); 
var proxy = require('./zeusProxy');
var http = require('http');
var numCPUs = require ('os').cpus().length;

if(cluster.isMaster)
{
    console.log("Number of cpu " + numCPUs);
    for (var i =0;i < numCPUs ; i ++)
    {
        cluster.fork();
    }
    cluster.on('exit',function(worker,code,signal)
    {
        console.log('worker' + worker.process.pid + 'died');

    });

    cluster.on('online', function(worker) {
        console.log("Yay, the worker responded after it was forked:" + worker.process.pid);
    });
 
}else {
console.log("Loading none cluster");
//start the proxy server
proxy.start();

//start the zeus application 
var app = require("./app.js");
}


