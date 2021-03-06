'use strict';

const mm = require('egg-mock');
const urllib = require('../../../lib/core/urllib');

describe('test/lib/core/urllib.test.js', () => {
  let client;
  const url = 'https://a.alipayobjects.com/aliBridge/1.0.0/aliBridge.min.js';

  before(() => {
    client = urllib({
      config: {},
    });
    client.on('request', info => {
      info.args.headers = info.args.headers || {};
      info.args.headers['mock-traceid'] = 'mock-traceid';
      info.args.headers['mock-rpcid'] = 'mock-rpcid';
    });
  });

  afterEach(mm.restore);

  it('should request ok with log', done => {
    const args = {
      dataType: 'text',
    };
    client.once('response', info => {
      info.req.options.headers['mock-traceid'].should.equal('mock-traceid');
      info.req.options.headers['mock-rpcid'].should.equal('mock-rpcid');
      done();
    });

    client.request(url, args);
  });

  it('should request callback with log', done => {
    client.once('response', info => {
      info.req.options.headers['mock-traceid'].should.equal('mock-traceid');
      info.req.options.headers['mock-rpcid'].should.equal('mock-rpcid');
      done();
    });

    client.request(url, () => {});
  });

  it('should curl ok with log', done => {
    const args = {
      dataType: 'text',
    };
    client.once('response', info => {
      info.req.options.headers['mock-traceid'].should.equal('mock-traceid');
      info.req.options.headers['mock-rpcid'].should.equal('mock-rpcid');
      done();
    });

    client.curl(url, args);
  });

  it('should requestThunk ok with log', function* () {
    const args = {
      dataType: 'text',
    };
    client.once('response', info => {
      info.req.options.headers['mock-traceid'].should.equal('mock-traceid');
      info.req.options.headers['mock-rpcid'].should.equal('mock-rpcid');
    });

    yield client.requestThunk(url, args);
  });

  it('should request error with log', done => {
    mm.http.requestError(/.*/i, null, 'mock res error');

    client.once('response', info => {
      info.req.options.headers['mock-traceid'].should.equal('mock-traceid');
      info.req.options.headers['mock-rpcid'].should.equal('mock-rpcid');
      info.error.message.should.containEql('mock res error');
      done();
    });

    client.request(url);
  });
});
