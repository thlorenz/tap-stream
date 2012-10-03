'use strict';

var util     =  require('util')
  , through  =  require('through')
  , toString =  Object.prototype.toString
  , slice    =  Array.prototype.slice;

function blowup () {
  throw new Error('Argument to streamTap needs to be either Number for depth or a log Function');
}

function defaultLog (depth) {
  function log (data) {
    console.log(util.inspect(data, false, depth, true));
  }

  return function (data) {
    if (arguments.length === 1) {
      log(data);
    } else {
      slice.call(arguments).forEach(log);
    }
  };
}

// invoke four ways:
//  tap ()
//  tap (depth)
//  tap (log)
function tap (arg0) {
  var log;

  if (!arguments.length) {
    log = defaultLog(1);
  } else {

    if (toString.call(arg0) === '[object Number]' ) {
      log = defaultLog(arg0);
    } else if (toString.call(arg0) === '[object Function]' ) {
      log = arg0;
    } else {
      blowup();
    }

  }

  return through(
    function write (data) {
      log(data);
      this.emit('data', data);
    }
  );

}

module.exports = tap;

if (module.parent) return;

var Stream = require('stream');

function objectStream () {
  var s = new Stream()
    , objects = 0;
 
  var iv = setInterval(
      function () {
        s.emit('data', { 
            id: objects
          , created: new Date()
          , nest: { 
                name: 'yellow rumped warbler'
              , age: 1
              , egg: { name: 'unknown' , age: 0 }
              } 
          }
        , 4
        );

        if (++objects === 2) {
            s.emit('end');
            clearInterval(iv);
        }
      }
    , 200);
  return s;
}

objectStream().pipe(tap(2));

