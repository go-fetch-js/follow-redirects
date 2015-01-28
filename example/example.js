var HttpClient = require('go-fetch');
var follower = require('..');

HttpClient()
	.use(follower())
	.get('http://google.com.au', function(error, response) {
		console.log(error, response.getStatus());
	})
;