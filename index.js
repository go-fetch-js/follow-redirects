var debug = require('debug')('go-fetch-follow-redirects');

/**
 * Follow redirects
 * @returns {function(Client)}
 */
module.exports = function() {
	return function(client) {
		client.on('after', function(request, response, next) {

			var location = response.getHeader('Location');

			//check there's a location to redirect to
			if (!location) {
				return next();
			}

			//load the new response
			debug('following redirect to "%s"', location);
			client.get(location, {}, function(error, followedResponse) {
				if (error) return next(error);

				//TODO: when using an event object in the future, switch the response object instead of copying properties
				response
					.setStatus(followedResponse.getStatus())
					.setHeaders(followedResponse.getHeaders())
					.setBody(followedResponse.getBody())
				;

				next();
			});

		});
	};
};
