var assert    = require('assert');
var sinon     = require('sinon');
var follower  = require('..');

function clientFixture() {
  return {
    on: sinon.spy(),
    get: sinon.spy()
  };
}

function eventFixture() {

  var request = {
    getUrl: sinon.stub()
  };

  var response = {
    getHeader:  sinon.stub(),
    setStatus:  sinon.stub(),
    setHeaders: sinon.stub(),
    setBody:    sinon.stub()
  };

  response.setStatus.returns(response);
  response.setHeaders.returns(response);
  response.setBody.returns(response);

  return {
    request:  request,
    response: response
  };

}


describe('follow-redirects', function() {

  it('should register after event handler', function() {
    var fn = follower(), client = clientFixture();
    fn(client);
    client.on.calledWith('after');
  });

  it('should not do anything if a location is not specified', function(done) {
    var fn = follower(), client = clientFixture(), event = eventFixture();
    fn(client);

    event.response.getHeader.returns(null);

    client.on.args[0][1].call(client, event, function(err) {
      assert.equal(null, err);
      assert(event.response.setStatus.notCalled);
      done();
    });

  });

  it('should resolve an absolute URL', function() {
    var fn = follower(), client = clientFixture(), event = eventFixture();
    fn(client);

    event.request.getUrl.returns('http://example.com/hello-world');
    event.response.getHeader.returns('/foo-bar');

    client.on.args[0][1].call(client, event, function() {});
    assert(client.get.calledWith('http://example.com/foo-bar'));

  });

  it('should update the response', function(done) {
    var fn = follower(), client = clientFixture(), event = eventFixture();
    fn(client);

    event.request.getUrl.returns('http://example.com/hello-world');
    event.response.getHeader.returns('/foo-bar');

    client.on.args[0][1].call(client, event, function(err) {
      assert.equal(null, err);
      assert(event.response.setStatus.calledWith(200));
      assert(event.response.setHeaders.calledWith({'Content-Type': 'text/html'}));
      assert(event.response.setBody.calledWith('<html>'));
      done();
    });

    client.get.args[0][2].call(client, null, {
      getStatus: sinon.stub().returns(200),
      getHeaders: sinon.stub().returns({'Content-Type': 'text/html'}),
      getBody: sinon.stub().returns('<html>')
    });

  });

});