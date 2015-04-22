"use strict";

const SandGrain = require('sand-grain');
const Memcached = require('memcached')
const _ = require('lodash');

class Memcache extends SandGrain {
  constructor() {
    super();

    this.name = 'memcache';
    this.defaultConfig = require('./defaultConfig');
    this.version = require('../package').version;
  }

  init(config, done) {
    super.init(config);
    this.client = this.createClient();
    done();
  }

  shutdown(done) {
    if (this.client) {
      this.client.end();
    }
    done();
  }

  createClient() {
    return new Memcached(this.config.servers, this.config.options);
  }

  get(key, callback) {
    return runPromiseOrCallback.call(this, get, callback);

    function get(callback) {
      return this.client[_.isArray(key) ? 'getMulti' : 'get'](key, callback);
    }
  }

  set(key, value, expiry, callback) {
    return runPromiseOrCallback.call(this, set, callback);

    function set(callback) {
      this.client.set(key, value, expiry, callback);
    }
  }

  del(key, callback) {
    return runPromiseOrCallback.call(this, del, callback);

    function del(callback) {
      this.client.del(key, callback);
    }
  }
}

module.exports = Memcache;

function runPromiseOrCallback(toRun, callback) {
  let self = this;
  if (!callback) {
    return new Promise(function(resolve, reject) {
      callback = function(err, result) {
        if (err) {
          return reject(err);
        }
        resolve(result);
      };
      toRun.call(self, callback);
    });
  }

  toRun.call(self, callback);
}