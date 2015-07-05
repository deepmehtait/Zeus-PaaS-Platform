var bouncy = require('bouncy'), readWriteFile = require("./routes/readWriteJson");

// @Utsav Popli: This code will start the proxy server
// on the port 80
var proxyPort = 80;
var zeusPort = 3001;
// When the user will hit its own sub-domain then it will search for the
// sub domain in the database and if it exists, then it will fetch the
// corrosponding PORT from the DB and will proxy to the port

module.exports = {
	start : function() {
		var proxy_server = bouncy(function(req, res, bounce) {
			console.log("bouncy cp 1");
			var host = req.headers.host;
			var portMapping = readWriteFile.readMapping();

			// var trialMapping = ' ,' + '\"'+ trialDomain + '\"' + ":" +
			// '\"'+trialPort+'\"' +"}";

			// For delete from Mapping
			// var trialDelete =","+ '\"'+ trialDomain + '\"' + ":" +
			// '\"'+trialPort+'\"';

			// Search the database
			// if the request url matches in the database
			// the get the port and bounce the request to that port

			if (portMapping[host]) {
				console.log("proxy hit by: " + req.headers.host);
				console.log("proxy mapping port " + portMapping[host]);

				bounce(portMapping[host]);

			} else {
				console.log("CP12");
				bounce(zeusPort);
			}

		});

		proxy_server.listen(proxyPort, function() {
			console.log("Proxy Server has started on Port " + proxyPort);
		});

	}
};
