var URL   = require('url');
var debug = require('debug')('go-fetch-follow-redirects');

/**
 * Follow redirects
 * @returns {function(Client)}
 */
module.exports = function() {
	return function(client) {
		client.on('after', function(event, next) {

			var location = event.response.getHeader('Location');

			//check there's a location to redirect to
			if (!location) {
				return next();
			}
			
			//resolve URL for servers which don't return a URL including the scheme and hostname
			location = URL.resolve(event.request.getUrl().toString(), location);

			//load the new response
			debug('following redirect from "%s" to "%s"', event.request.getUrl().toString(), location);
      client.get(location, {}, function(error, followedResponse) {
				if (error) return next(error);

				event.response
					.setStatus(followedResponse.getStatus())
					.setHeaders(followedResponse.getHeaders())
					.setBody(followedResponse.getBody())
				;

				next();
			});

		});
	};
};
