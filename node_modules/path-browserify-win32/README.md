# path-browserify-win32

> The `path` module from Node.js for browsers

This implements the Node.js [`path`][path] module for environments that do not have it, like browsers. It was forked from `path-browserify` to add the win32 functions so both POSIX and Windows paths are supported.

> `path-browserify-win32` currently matches the **Node.js 23.4** API.

## Install

```
npm install path-browserify-win32
```

## Usage

```javascript
var path = require('path')

var filename = 'logo.png';
var logo = path.join('./assets/img', filename);
document.querySelector('#logo').src = logo;
```

## API

See the [Node.js path docs][path]. `path-browserify-win32` currently matches the Node.js 23.4 API.

## Contributing

PRs are very welcome! The main way to contribute to `path-browserify-win32` is by porting features, bugfixes and tests from Node.js. Ideally, code contributions to this module are copy-pasted from Node.js and transpiled to ES5, rather than reimplemented from scratch. Matching the Node.js code as closely as possible makes maintenance simpler when new changes land in Node.js.
This module intends to provide exactly the same API as Node.js, so features that are not available in the core `path` module will not be accepted. Feature requests should instead be directed at [nodejs/node](https://github.com/nodejs/node) and will be added to this module once they are implemented in Node.js.

If there is a difference in behaviour between Node.js's `path` module and this module, please open an issue!

## License

[MIT](./LICENSE)

[path]: https://nodejs.org/docs/v23.4.0/api/path.html
