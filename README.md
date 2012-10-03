# tap-stream

Taps a nodejs stream and prints the data that's coming through.

Detail of printed objects can be controlled via the `depth` parameter.

For even more control a custom log function be supplied

```javascript
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
```

`objectStream().pipe(tap(0));`:

![depth0](https://github.com/thlorenz/tap-stream/raw/master/assets/depth0.png)

`objectStream().pipe(tap(1));`:

![depth1](https://github.com/thlorenz/tap-stream/raw/master/assets/depth1.png)

`objectStream().pipe(tap(2));`:

![depth2](https://github.com/thlorenz/tap-stream/raw/master/assets/depth2.png)
