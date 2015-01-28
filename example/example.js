var HttpClient = require('go-fetch');
var follower = require('..');

HttpClient()
	.use(follower())
	.get('http://www.google.com/', function(error, response) {
		console.log(error, response.getStatus());
	})
;