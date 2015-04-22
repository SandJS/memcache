"use strict";

const sand = require('sand');
const memcache = require('..');
const memcached = require('memcached');
const co = require('co');

const servers = '<yourserver>:11211';

let c = new memcached(servers);

c.set('mykey', 'myvalue', 10, function() {
  console.log(arguments);

  c.get('mykey', function() {
    console.log(arguments);

    c.end();

  });

});


(new sand({log: '*'})).use(memcache, {all: {servers: servers}}).start(function() {

  global.sand.memcache.set('thekey', 'thevalue', 10, function() {
    console.log(arguments);
    global.sand.memcache.get('thekey', function() {
      console.log(arguments);
      global.sand.memcache.del('thekey', function() {
        console.log(arguments);
        global.sand.memcache.get('thekey', function() {
          console.log(arguments);
          co(function *() {
            let result = yield global.sand.memcache.set('thekey', 'thevalue', 10);
            console.log(result);

            result = yield global.sand.memcache.get('thekey');
            console.log(result);

            result = yield global.sand.memcache.del('thekey');
            console.log(result);

            result = yield global.sand.memcache.get('thekey');
            console.log(result);

            global.sand.shutdown();
          });
        });
      });
    });
  });
});