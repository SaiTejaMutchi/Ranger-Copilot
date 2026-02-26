'use strict';
const common = require('./common');
const assert = require('assert');
const path = require('path');

const failures = [];
const slashRE = /\//g;
const backslashRE = /\\/g;

const posixyCwd = common.isWindows ?
  (() => {
    const _ = process.cwd()
      .replaceAll(path.sep, path.posix.sep);
    return _.slice(_.indexOf(path.posix.sep));
  })() :
  process.cwd();

const resolveTests = [
  [ path.win32.resolve,
    // Arguments                               result
    [[['c:/blah\\blah', 'd:/games', 'c:../a'], 'c:\\blah\\a'],
     [['c:/ignore', 'd:\\a/b\\c/d', '\\e.exe'], 'd:\\e.exe'],
     [['c:/ignore', 'c:/some/file'], 'c:\\some\\file'],
     [['d:/ignore', 'd:some/dir//'], 'd:\\ignore\\some\\dir'],
     [['.'], process.cwd()],
     [['//server/share', '..', 'relative\\'], '\\\\server\\share\\relative'],
     [['c:/', '//'], 'c:\\'],
     [['c:/', '//dir'], 'c:\\dir'],
     [['c:/', '//server/share'], '\\\\server\\share\\'],
     [['c:/', '//server//share'], '\\\\server\\share\\'],
     [['c:/', '///some//dir'], 'c:\\some\\dir'],
     [['C:\\foo\\tmp.3\\', '..\\tmp.3\\cycles\\root.js'],
      'C:\\foo\\tmp.3\\cycles\\root.js'],
    //  [['\\\\.\\PHYSICALDRIVE0'], '\\\\.\\PHYSICALDRIVE0'],
    //  [['\\\\?\\PHYSICALDRIVE0'], '\\\\?\\PHYSICALDRIVE0'],
    ],
  ],
  [ path.posix.resolve,
    // Arguments                    result
    [[['/var/lib', '../', 'file/'], '/var/file'],
     [['/var/lib', '/../', 'file/'], '/file'],
     [['a/b/c/', '../../..'], posixyCwd],
     [['.'], posixyCwd],
     [['/some/dir', '.', '/absolute/'], '/absolute'],
     [['/foo/tmp.3/', '../tmp.3/cycles/root.js'], '/foo/tmp.3/cycles/root.js'],
    ],
  ],
];
resolveTests.forEach(([resolve, tests]) => {
  tests.forEach(([test, expected]) => {
    const actual = resolve.apply(null, test);
    let actualAlt;
    const os = resolve === path.win32.resolve ? 'win32' : 'posix';
    if (resolve === path.win32.resolve && !common.isWindows)
      actualAlt = actual.replace(backslashRE, '/');
    else if (resolve !== path.win32.resolve && common.isWindows)
      actualAlt = actual.replace(slashRE, '\\');

    const message =
      `path.${os}.resolve(${test.map(JSON.stringify).join(',')})\n  expect=${
        JSON.stringify(expected)}\n  actual=${JSON.stringify(actual)}`;
    if (actual !== expected && actualAlt !== expected)
      failures.push(message);
  });
});
assert.strictEqual(failures.length, 0, failures.join('\n'));

if (!common.isWindows) {
  // Test handling relative paths to be safe when process.cwd() fails.
  process.cwd = () => '';
  assert.strictEqual(process.cwd(), '');
  const resolved = path.resolve();
  const expected = '.';
  assert.strictEqual(resolved, expected);
}
