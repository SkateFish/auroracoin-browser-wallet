(function (f) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = f();
  } else if (typeof define === 'function' && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== 'undefined') {
      g = window;
    } else if (typeof global !== 'undefined') {
      g = global;
    } else if (typeof self !== 'undefined') {
      g = self;
    } else {
      g = this;
    }
    g.bitcoinjs_aur = f();
  }
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = 'function' == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw ((a.code = 'MODULE_NOT_FOUND'), a);
          }
          var p = (n[i] = { exports: {} });
          e[i][0].call(
            p.exports,
            function (r) {
              var n = e[i][1][r];
              return o(n || r);
            },
            p,
            p.exports,
            r,
            e,
            n,
            t
          );
        }
        return n[i].exports;
      }
      for (
        var u = 'function' == typeof require && require, i = 0;
        i < t.length;
        i++
      )
        o(t[i]);
      return o;
    }
    return r;
  })()(
    {
      '/': [
        function (require, module, exports) {
          var script = require('./script');

          var templates = require('./templates');
          for (var key in templates) {
            script[key] = templates[key];
          }

          module.exports = {
            bufferutils: require('./bufferutils'), // TODO: remove in 4.0.0

            Block: require('./block'),
            ECPair: require('./ecpair'),
            ECSignature: require('./ecsignature'),
            HDNode: require('./hdnode'),
            Transaction: require('./transaction'),
            TransactionBuilder: require('./transaction_builder'),
            Buffer: require('./buffer').Buffer,
            SafeBuffer: require('safe-buffer').Buffer,
            bs58check: require('./bs58check'),
            address: require('./address'),
            crypto: require('./crypto'),
            networks: require('./networks'),
            opcodes: require('bitcoin-ops'),
            script: script,
          };
        },
        {
          './buffer': 7,
          'safe-buffer': 14,
          './bs58check': 92,
          './address': 93,
          './block': 94,
          './bufferutils': 95,
          './crypto': 96,
          './ecpair': 98,
          './ecsignature': 99,
          './hdnode': 100,
          './networks': 101,
          './script': 102,
          './templates': 104,
          './transaction': 126,
          './transaction_builder': 127,
          'bitcoin-ops': 39,
        },
      ],
      1: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              'use strict';

              var objectAssign = require('object-assign');

              // compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
              // original notice:

              /*!
               * The buffer module from node.js, for the browser.
               *
               * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
               * @license  MIT
               */
              function compare(a, b) {
                if (a === b) {
                  return 0;
                }

                var x = a.length;
                var y = b.length;

                for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                  if (a[i] !== b[i]) {
                    x = a[i];
                    y = b[i];
                    break;
                  }
                }

                if (x < y) {
                  return -1;
                }
                if (y < x) {
                  return 1;
                }
                return 0;
              }
              function isBuffer(b) {
                if (
                  global.Buffer &&
                  typeof global.Buffer.isBuffer === 'function'
                ) {
                  return global.Buffer.isBuffer(b);
                }
                return !!(b != null && b._isBuffer);
              }

              // based on node assert, original notice:
              // NB: The URL to the CommonJS spec is kept just for tradition.
              //     node-assert has evolved a lot since then, both in API and behavior.

              // http://wiki.commonjs.org/wiki/Unit_Testing/1.0
              //
              // THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
              //
              // Originally from narwhal.js (http://narwhaljs.org)
              // Copyright (c) 2009 Thomas Robinson <280north.com>
              //
              // Permission is hereby granted, free of charge, to any person obtaining a copy
              // of this software and associated documentation files (the 'Software'), to
              // deal in the Software without restriction, including without limitation the
              // rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
              // sell copies of the Software, and to permit persons to whom the Software is
              // furnished to do so, subject to the following conditions:
              //
              // The above copyright notice and this permission notice shall be included in
              // all copies or substantial portions of the Software.
              //
              // THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              // AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
              // ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
              // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

              var util = require('util/');
              var hasOwn = Object.prototype.hasOwnProperty;
              var pSlice = Array.prototype.slice;
              var functionsHaveNames = (function () {
                return function foo() {}.name === 'foo';
              })();
              function pToString(obj) {
                return Object.prototype.toString.call(obj);
              }
              function isView(arrbuf) {
                if (isBuffer(arrbuf)) {
                  return false;
                }
                if (typeof global.ArrayBuffer !== 'function') {
                  return false;
                }
                if (typeof ArrayBuffer.isView === 'function') {
                  return ArrayBuffer.isView(arrbuf);
                }
                if (!arrbuf) {
                  return false;
                }
                if (arrbuf instanceof DataView) {
                  return true;
                }
                if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
                  return true;
                }
                return false;
              }
              // 1. The assert module provides functions that throw
              // AssertionError's when particular conditions are not met. The
              // assert module must conform to the following interface.

              var assert = (module.exports = ok);

              // 2. The AssertionError is defined in assert.
              // new assert.AssertionError({ message: message,
              //                             actual: actual,
              //                             expected: expected })

              var regex = /\s*function\s+([^\(\s]*)\s*/;
              // based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
              function getName(func) {
                if (!util.isFunction(func)) {
                  return;
                }
                if (functionsHaveNames) {
                  return func.name;
                }
                var str = func.toString();
                var match = str.match(regex);
                return match && match[1];
              }
              assert.AssertionError = function AssertionError(options) {
                this.name = 'AssertionError';
                this.actual = options.actual;
                this.expected = options.expected;
                this.operator = options.operator;
                if (options.message) {
                  this.message = options.message;
                  this.generatedMessage = false;
                } else {
                  this.message = getMessage(this);
                  this.generatedMessage = true;
                }
                var stackStartFunction = options.stackStartFunction || fail;
                if (Error.captureStackTrace) {
                  Error.captureStackTrace(this, stackStartFunction);
                } else {
                  // non v8 browsers so we can have a stacktrace
                  var err = new Error();
                  if (err.stack) {
                    var out = err.stack;

                    // try to strip useless frames
                    var fn_name = getName(stackStartFunction);
                    var idx = out.indexOf('\n' + fn_name);
                    if (idx >= 0) {
                      // once we have located the function frame
                      // we need to strip out everything before it (and its line)
                      var next_line = out.indexOf('\n', idx + 1);
                      out = out.substring(next_line + 1);
                    }

                    this.stack = out;
                  }
                }
              };

              // assert.AssertionError instanceof Error
              util.inherits(assert.AssertionError, Error);

              function truncate(s, n) {
                if (typeof s === 'string') {
                  return s.length < n ? s : s.slice(0, n);
                } else {
                  return s;
                }
              }
              function inspect(something) {
                if (functionsHaveNames || !util.isFunction(something)) {
                  return util.inspect(something);
                }
                var rawname = getName(something);
                var name = rawname ? ': ' + rawname : '';
                return '[Function' + name + ']';
              }
              function getMessage(self) {
                return (
                  truncate(inspect(self.actual), 128) +
                  ' ' +
                  self.operator +
                  ' ' +
                  truncate(inspect(self.expected), 128)
                );
              }

              // At present only the three keys mentioned above are used and
              // understood by the spec. Implementations or sub modules can pass
              // other keys to the AssertionError's constructor - they will be
              // ignored.

              // 3. All of the following functions must throw an AssertionError
              // when a corresponding condition is not met, with a message that
              // may be undefined if not provided.  All assertion methods provide
              // both the actual and expected values to the assertion error for
              // display purposes.

              function fail(
                actual,
                expected,
                message,
                operator,
                stackStartFunction
              ) {
                throw new assert.AssertionError({
                  message: message,
                  actual: actual,
                  expected: expected,
                  operator: operator,
                  stackStartFunction: stackStartFunction,
                });
              }

              // EXTENSION! allows for well behaved errors defined elsewhere.
              assert.fail = fail;

              // 4. Pure assertion tests whether a value is truthy, as determined
              // by !!guard.
              // assert.ok(guard, message_opt);
              // This statement is equivalent to assert.equal(true, !!guard,
              // message_opt);. To test strictly for the value true, use
              // assert.strictEqual(true, guard, message_opt);.

              function ok(value, message) {
                if (!value) fail(value, true, message, '==', assert.ok);
              }
              assert.ok = ok;

              // 5. The equality assertion tests shallow, coercive equality with
              // ==.
              // assert.equal(actual, expected, message_opt);

              assert.equal = function equal(actual, expected, message) {
                if (actual != expected)
                  fail(actual, expected, message, '==', assert.equal);
              };

              // 6. The non-equality assertion tests for whether two objects are not equal
              // with != assert.notEqual(actual, expected, message_opt);

              assert.notEqual = function notEqual(actual, expected, message) {
                if (actual == expected) {
                  fail(actual, expected, message, '!=', assert.notEqual);
                }
              };

              // 7. The equivalence assertion tests a deep equality relation.
              // assert.deepEqual(actual, expected, message_opt);

              assert.deepEqual = function deepEqual(actual, expected, message) {
                if (!_deepEqual(actual, expected, false)) {
                  fail(
                    actual,
                    expected,
                    message,
                    'deepEqual',
                    assert.deepEqual
                  );
                }
              };

              assert.deepStrictEqual = function deepStrictEqual(
                actual,
                expected,
                message
              ) {
                if (!_deepEqual(actual, expected, true)) {
                  fail(
                    actual,
                    expected,
                    message,
                    'deepStrictEqual',
                    assert.deepStrictEqual
                  );
                }
              };

              function _deepEqual(actual, expected, strict, memos) {
                // 7.1. All identical values are equivalent, as determined by ===.
                if (actual === expected) {
                  return true;
                } else if (isBuffer(actual) && isBuffer(expected)) {
                  return compare(actual, expected) === 0;

                  // 7.2. If the expected value is a Date object, the actual value is
                  // equivalent if it is also a Date object that refers to the same time.
                } else if (util.isDate(actual) && util.isDate(expected)) {
                  return actual.getTime() === expected.getTime();

                  // 7.3 If the expected value is a RegExp object, the actual value is
                  // equivalent if it is also a RegExp object with the same source and
                  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
                } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
                  return (
                    actual.source === expected.source &&
                    actual.global === expected.global &&
                    actual.multiline === expected.multiline &&
                    actual.lastIndex === expected.lastIndex &&
                    actual.ignoreCase === expected.ignoreCase
                  );

                  // 7.4. Other pairs that do not both pass typeof value == 'object',
                  // equivalence is determined by ==.
                } else if (
                  (actual === null || typeof actual !== 'object') &&
                  (expected === null || typeof expected !== 'object')
                ) {
                  return strict ? actual === expected : actual == expected;

                  // If both values are instances of typed arrays, wrap their underlying
                  // ArrayBuffers in a Buffer each to increase performance
                  // This optimization requires the arrays to have the same type as checked by
                  // Object.prototype.toString (aka pToString). Never perform binary
                  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
                  // bit patterns are not identical.
                } else if (
                  isView(actual) &&
                  isView(expected) &&
                  pToString(actual) === pToString(expected) &&
                  !(
                    actual instanceof Float32Array ||
                    actual instanceof Float64Array
                  )
                ) {
                  return (
                    compare(
                      new Uint8Array(actual.buffer),
                      new Uint8Array(expected.buffer)
                    ) === 0
                  );

                  // 7.5 For all other Object pairs, including Array objects, equivalence is
                  // determined by having the same number of owned properties (as verified
                  // with Object.prototype.hasOwnProperty.call), the same set of keys
                  // (although not necessarily the same order), equivalent values for every
                  // corresponding key, and an identical 'prototype' property. Note: this
                  // accounts for both named and indexed properties on Arrays.
                } else if (isBuffer(actual) !== isBuffer(expected)) {
                  return false;
                } else {
                  memos = memos || { actual: [], expected: [] };

                  var actualIndex = memos.actual.indexOf(actual);
                  if (actualIndex !== -1) {
                    if (actualIndex === memos.expected.indexOf(expected)) {
                      return true;
                    }
                  }

                  memos.actual.push(actual);
                  memos.expected.push(expected);

                  return objEquiv(actual, expected, strict, memos);
                }
              }

              function isArguments(object) {
                return (
                  Object.prototype.toString.call(object) == '[object Arguments]'
                );
              }

              function objEquiv(a, b, strict, actualVisitedObjects) {
                if (
                  a === null ||
                  a === undefined ||
                  b === null ||
                  b === undefined
                )
                  return false;
                // if one is a primitive, the other must be same
                if (util.isPrimitive(a) || util.isPrimitive(b)) return a === b;
                if (
                  strict &&
                  Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)
                )
                  return false;
                var aIsArgs = isArguments(a);
                var bIsArgs = isArguments(b);
                if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
                  return false;
                if (aIsArgs) {
                  a = pSlice.call(a);
                  b = pSlice.call(b);
                  return _deepEqual(a, b, strict);
                }
                var ka = objectKeys(a);
                var kb = objectKeys(b);
                var key, i;
                // having the same number of owned properties (keys incorporates
                // hasOwnProperty)
                if (ka.length !== kb.length) return false;
                //the same set of keys (although not necessarily the same order),
                ka.sort();
                kb.sort();
                //~~~cheap key test
                for (i = ka.length - 1; i >= 0; i--) {
                  if (ka[i] !== kb[i]) return false;
                }
                //equivalent values for every corresponding key, and
                //~~~possibly expensive deep test
                for (i = ka.length - 1; i >= 0; i--) {
                  key = ka[i];
                  if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
                    return false;
                }
                return true;
              }

              // 8. The non-equivalence assertion tests for any deep inequality.
              // assert.notDeepEqual(actual, expected, message_opt);

              assert.notDeepEqual = function notDeepEqual(
                actual,
                expected,
                message
              ) {
                if (_deepEqual(actual, expected, false)) {
                  fail(
                    actual,
                    expected,
                    message,
                    'notDeepEqual',
                    assert.notDeepEqual
                  );
                }
              };

              assert.notDeepStrictEqual = notDeepStrictEqual;
              function notDeepStrictEqual(actual, expected, message) {
                if (_deepEqual(actual, expected, true)) {
                  fail(
                    actual,
                    expected,
                    message,
                    'notDeepStrictEqual',
                    notDeepStrictEqual
                  );
                }
              }

              // 9. The strict equality assertion tests strict equality, as determined by ===.
              // assert.strictEqual(actual, expected, message_opt);

              assert.strictEqual = function strictEqual(
                actual,
                expected,
                message
              ) {
                if (actual !== expected) {
                  fail(actual, expected, message, '===', assert.strictEqual);
                }
              };

              // 10. The strict non-equality assertion tests for strict inequality, as
              // determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

              assert.notStrictEqual = function notStrictEqual(
                actual,
                expected,
                message
              ) {
                if (actual === expected) {
                  fail(actual, expected, message, '!==', assert.notStrictEqual);
                }
              };

              function expectedException(actual, expected) {
                if (!actual || !expected) {
                  return false;
                }

                if (
                  Object.prototype.toString.call(expected) == '[object RegExp]'
                ) {
                  return expected.test(actual);
                }

                try {
                  if (actual instanceof expected) {
                    return true;
                  }
                } catch (e) {
                  // Ignore.  The instanceof check doesn't work for arrow functions.
                }

                if (Error.isPrototypeOf(expected)) {
                  return false;
                }

                return expected.call({}, actual) === true;
              }

              function _tryBlock(block) {
                var error;
                try {
                  block();
                } catch (e) {
                  error = e;
                }
                return error;
              }

              function _throws(shouldThrow, block, expected, message) {
                var actual;

                if (typeof block !== 'function') {
                  throw new TypeError('"block" argument must be a function');
                }

                if (typeof expected === 'string') {
                  message = expected;
                  expected = null;
                }

                actual = _tryBlock(block);

                message =
                  (expected && expected.name
                    ? ' (' + expected.name + ').'
                    : '.') + (message ? ' ' + message : '.');

                if (shouldThrow && !actual) {
                  fail(
                    actual,
                    expected,
                    'Missing expected exception' + message
                  );
                }

                var userProvidedMessage = typeof message === 'string';
                var isUnwantedException = !shouldThrow && util.isError(actual);
                var isUnexpectedException = !shouldThrow && actual && !expected;

                if (
                  (isUnwantedException &&
                    userProvidedMessage &&
                    expectedException(actual, expected)) ||
                  isUnexpectedException
                ) {
                  fail(actual, expected, 'Got unwanted exception' + message);
                }

                if (
                  (shouldThrow &&
                    actual &&
                    expected &&
                    !expectedException(actual, expected)) ||
                  (!shouldThrow && actual)
                ) {
                  throw actual;
                }
              }

              // 11. Expected to throw an error:
              // assert.throws(block, Error_opt, message_opt);

              assert.throws = function (
                block,
                /*optional*/ error,
                /*optional*/ message
              ) {
                _throws(true, block, error, message);
              };

              // EXTENSION! This is annoying to write outside this module.
              assert.doesNotThrow = function (
                block,
                /*optional*/ error,
                /*optional*/ message
              ) {
                _throws(false, block, error, message);
              };

              assert.ifError = function (err) {
                if (err) throw err;
              };

              // Expose a strict only variant of assert
              function strict(value, message) {
                if (!value) fail(value, true, message, '==', strict);
              }
              assert.strict = objectAssign(strict, assert, {
                equal: assert.strictEqual,
                deepEqual: assert.deepStrictEqual,
                notEqual: assert.notStrictEqual,
                notDeepEqual: assert.notDeepStrictEqual,
              });
              assert.strict.strict = assert.strict;

              var objectKeys =
                Object.keys ||
                function (obj) {
                  var keys = [];
                  for (var key in obj) {
                    if (hasOwn.call(obj, key)) keys.push(key);
                  }
                  return keys;
                };
            }.call(this));
          }.call(
            this,
            typeof global !== 'undefined'
              ? global
              : typeof self !== 'undefined'
              ? self
              : typeof window !== 'undefined'
              ? window
              : {}
          ));
        },
        { 'object-assign': 12, 'util/': 4 },
      ],
      2: [
        function (require, module, exports) {
          if (typeof Object.create === 'function') {
            // implementation from standard node.js 'util' module
            module.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                  value: ctor,
                  enumerable: false,
                  writable: true,
                  configurable: true,
                },
              });
            };
          } else {
            // old school shim for old browsers
            module.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              var TempCtor = function () {};
              TempCtor.prototype = superCtor.prototype;
              ctor.prototype = new TempCtor();
              ctor.prototype.constructor = ctor;
            };
          }
        },
        {},
      ],
      3: [
        function (require, module, exports) {
          module.exports = function isBuffer(arg) {
            return (
              arg &&
              typeof arg === 'object' &&
              typeof arg.copy === 'function' &&
              typeof arg.fill === 'function' &&
              typeof arg.readUInt8 === 'function'
            );
          };
        },
        {},
      ],
      4: [
        function (require, module, exports) {
          (function (process, global) {
            (function () {
              // Copyright Joyent, Inc. and other Node contributors.
              //
              // Permission is hereby granted, free of charge, to any person obtaining a
              // copy of this software and associated documentation files (the
              // "Software"), to deal in the Software without restriction, including
              // without limitation the rights to use, copy, modify, merge, publish,
              // distribute, sublicense, and/or sell copies of the Software, and to permit
              // persons to whom the Software is furnished to do so, subject to the
              // following conditions:
              //
              // The above copyright notice and this permission notice shall be included
              // in all copies or substantial portions of the Software.
              //
              // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
              // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
              // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
              // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
              // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
              // USE OR OTHER DEALINGS IN THE SOFTWARE.

              var formatRegExp = /%[sdj%]/g;
              exports.format = function (f) {
                if (!isString(f)) {
                  var objects = [];
                  for (var i = 0; i < arguments.length; i++) {
                    objects.push(inspect(arguments[i]));
                  }
                  return objects.join(' ');
                }

                var i = 1;
                var args = arguments;
                var len = args.length;
                var str = String(f).replace(formatRegExp, function (x) {
                  if (x === '%%') return '%';
                  if (i >= len) return x;
                  switch (x) {
                    case '%s':
                      return String(args[i++]);
                    case '%d':
                      return Number(args[i++]);
                    case '%j':
                      try {
                        return JSON.stringify(args[i++]);
                      } catch (_) {
                        return '[Circular]';
                      }
                    default:
                      return x;
                  }
                });
                for (var x = args[i]; i < len; x = args[++i]) {
                  if (isNull(x) || !isObject(x)) {
                    str += ' ' + x;
                  } else {
                    str += ' ' + inspect(x);
                  }
                }
                return str;
              };

              // Mark that a method should not be used.
              // Returns a modified function which warns once by default.
              // If --no-deprecation is set, then it is a no-op.
              exports.deprecate = function (fn, msg) {
                // Allow for deprecating things in the process of starting up.
                if (isUndefined(global.process)) {
                  return function () {
                    return exports.deprecate(fn, msg).apply(this, arguments);
                  };
                }

                if (process.noDeprecation === true) {
                  return fn;
                }

                var warned = false;
                function deprecated() {
                  if (!warned) {
                    if (process.throwDeprecation) {
                      throw new Error(msg);
                    } else if (process.traceDeprecation) {
                      console.trace(msg);
                    } else {
                      console.error(msg);
                    }
                    warned = true;
                  }
                  return fn.apply(this, arguments);
                }

                return deprecated;
              };

              var debugs = {};
              var debugEnviron;
              exports.debuglog = function (set) {
                if (isUndefined(debugEnviron))
                  debugEnviron = process.env.NODE_DEBUG || '';
                set = set.toUpperCase();
                if (!debugs[set]) {
                  if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
                    var pid = process.pid;
                    debugs[set] = function () {
                      var msg = exports.format.apply(exports, arguments);
                      console.error('%s %d: %s', set, pid, msg);
                    };
                  } else {
                    debugs[set] = function () {};
                  }
                }
                return debugs[set];
              };

              /**
               * Echos the value of a value. Trys to print the value out
               * in the best way possible given the different types.
               *
               * @param {Object} obj The object to print out.
               * @param {Object} opts Optional options object that alters the output.
               */
              /* legacy: obj, showHidden, depth, colors*/
              function inspect(obj, opts) {
                // default options
                var ctx = {
                  seen: [],
                  stylize: stylizeNoColor,
                };
                // legacy...
                if (arguments.length >= 3) ctx.depth = arguments[2];
                if (arguments.length >= 4) ctx.colors = arguments[3];
                if (isBoolean(opts)) {
                  // legacy...
                  ctx.showHidden = opts;
                } else if (opts) {
                  // got an "options" object
                  exports._extend(ctx, opts);
                }
                // set default options
                if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
                if (isUndefined(ctx.depth)) ctx.depth = 2;
                if (isUndefined(ctx.colors)) ctx.colors = false;
                if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
                if (ctx.colors) ctx.stylize = stylizeWithColor;
                return formatValue(ctx, obj, ctx.depth);
              }
              exports.inspect = inspect;

              // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
              inspect.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39],
              };

              // Don't use 'blue' not visible on cmd.exe
              inspect.styles = {
                special: 'cyan',
                number: 'yellow',
                boolean: 'yellow',
                undefined: 'grey',
                null: 'bold',
                string: 'green',
                date: 'magenta',
                // "name": intentionally not styling
                regexp: 'red',
              };

              function stylizeWithColor(str, styleType) {
                var style = inspect.styles[styleType];

                if (style) {
                  return (
                    '\u001b[' +
                    inspect.colors[style][0] +
                    'm' +
                    str +
                    '\u001b[' +
                    inspect.colors[style][1] +
                    'm'
                  );
                } else {
                  return str;
                }
              }

              function stylizeNoColor(str, styleType) {
                return str;
              }

              function arrayToHash(array) {
                var hash = {};

                array.forEach(function (val, idx) {
                  hash[val] = true;
                });

                return hash;
              }

              function formatValue(ctx, value, recurseTimes) {
                // Provide a hook for user-specified inspect functions.
                // Check that value is an object with an inspect function on it
                if (
                  ctx.customInspect &&
                  value &&
                  isFunction(value.inspect) &&
                  // Filter out the util module, it's inspect function is special
                  value.inspect !== exports.inspect &&
                  // Also filter out any prototype objects using the circular check.
                  !(value.constructor && value.constructor.prototype === value)
                ) {
                  var ret = value.inspect(recurseTimes, ctx);
                  if (!isString(ret)) {
                    ret = formatValue(ctx, ret, recurseTimes);
                  }
                  return ret;
                }

                // Primitive types cannot have properties
                var primitive = formatPrimitive(ctx, value);
                if (primitive) {
                  return primitive;
                }

                // Look up the keys of the object.
                var keys = Object.keys(value);
                var visibleKeys = arrayToHash(keys);

                if (ctx.showHidden) {
                  keys = Object.getOwnPropertyNames(value);
                }

                // IE doesn't make error fields non-enumerable
                // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
                if (
                  isError(value) &&
                  (keys.indexOf('message') >= 0 ||
                    keys.indexOf('description') >= 0)
                ) {
                  return formatError(value);
                }

                // Some type of object without properties can be shortcutted.
                if (keys.length === 0) {
                  if (isFunction(value)) {
                    var name = value.name ? ': ' + value.name : '';
                    return ctx.stylize('[Function' + name + ']', 'special');
                  }
                  if (isRegExp(value)) {
                    return ctx.stylize(
                      RegExp.prototype.toString.call(value),
                      'regexp'
                    );
                  }
                  if (isDate(value)) {
                    return ctx.stylize(
                      Date.prototype.toString.call(value),
                      'date'
                    );
                  }
                  if (isError(value)) {
                    return formatError(value);
                  }
                }

                var base = '',
                  array = false,
                  braces = ['{', '}'];

                // Make Array say that they are Array
                if (isArray(value)) {
                  array = true;
                  braces = ['[', ']'];
                }

                // Make functions say that they are functions
                if (isFunction(value)) {
                  var n = value.name ? ': ' + value.name : '';
                  base = ' [Function' + n + ']';
                }

                // Make RegExps say that they are RegExps
                if (isRegExp(value)) {
                  base = ' ' + RegExp.prototype.toString.call(value);
                }

                // Make dates with properties first say the date
                if (isDate(value)) {
                  base = ' ' + Date.prototype.toUTCString.call(value);
                }

                // Make error with message first say the error
                if (isError(value)) {
                  base = ' ' + formatError(value);
                }

                if (keys.length === 0 && (!array || value.length == 0)) {
                  return braces[0] + base + braces[1];
                }

                if (recurseTimes < 0) {
                  if (isRegExp(value)) {
                    return ctx.stylize(
                      RegExp.prototype.toString.call(value),
                      'regexp'
                    );
                  } else {
                    return ctx.stylize('[Object]', 'special');
                  }
                }

                ctx.seen.push(value);

                var output;
                if (array) {
                  output = formatArray(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    keys
                  );
                } else {
                  output = keys.map(function (key) {
                    return formatProperty(
                      ctx,
                      value,
                      recurseTimes,
                      visibleKeys,
                      key,
                      array
                    );
                  });
                }

                ctx.seen.pop();

                return reduceToSingleString(output, base, braces);
              }

              function formatPrimitive(ctx, value) {
                if (isUndefined(value))
                  return ctx.stylize('undefined', 'undefined');
                if (isString(value)) {
                  var simple =
                    "'" +
                    JSON.stringify(value)
                      .replace(/^"|"$/g, '')
                      .replace(/'/g, "\\'")
                      .replace(/\\"/g, '"') +
                    "'";
                  return ctx.stylize(simple, 'string');
                }
                if (isNumber(value)) return ctx.stylize('' + value, 'number');
                if (isBoolean(value)) return ctx.stylize('' + value, 'boolean');
                // For some reason typeof null is "object", so special case here.
                if (isNull(value)) return ctx.stylize('null', 'null');
              }

              function formatError(value) {
                return '[' + Error.prototype.toString.call(value) + ']';
              }

              function formatArray(
                ctx,
                value,
                recurseTimes,
                visibleKeys,
                keys
              ) {
                var output = [];
                for (var i = 0, l = value.length; i < l; ++i) {
                  if (hasOwnProperty(value, String(i))) {
                    output.push(
                      formatProperty(
                        ctx,
                        value,
                        recurseTimes,
                        visibleKeys,
                        String(i),
                        true
                      )
                    );
                  } else {
                    output.push('');
                  }
                }
                keys.forEach(function (key) {
                  if (!key.match(/^\d+$/)) {
                    output.push(
                      formatProperty(
                        ctx,
                        value,
                        recurseTimes,
                        visibleKeys,
                        key,
                        true
                      )
                    );
                  }
                });
                return output;
              }

              function formatProperty(
                ctx,
                value,
                recurseTimes,
                visibleKeys,
                key,
                array
              ) {
                var name, str, desc;
                desc = Object.getOwnPropertyDescriptor(value, key) || {
                  value: value[key],
                };
                if (desc.get) {
                  if (desc.set) {
                    str = ctx.stylize('[Getter/Setter]', 'special');
                  } else {
                    str = ctx.stylize('[Getter]', 'special');
                  }
                } else {
                  if (desc.set) {
                    str = ctx.stylize('[Setter]', 'special');
                  }
                }
                if (!hasOwnProperty(visibleKeys, key)) {
                  name = '[' + key + ']';
                }
                if (!str) {
                  if (ctx.seen.indexOf(desc.value) < 0) {
                    if (isNull(recurseTimes)) {
                      str = formatValue(ctx, desc.value, null);
                    } else {
                      str = formatValue(ctx, desc.value, recurseTimes - 1);
                    }
                    if (str.indexOf('\n') > -1) {
                      if (array) {
                        str = str
                          .split('\n')
                          .map(function (line) {
                            return '  ' + line;
                          })
                          .join('\n')
                          .substr(2);
                      } else {
                        str =
                          '\n' +
                          str
                            .split('\n')
                            .map(function (line) {
                              return '   ' + line;
                            })
                            .join('\n');
                      }
                    }
                  } else {
                    str = ctx.stylize('[Circular]', 'special');
                  }
                }
                if (isUndefined(name)) {
                  if (array && key.match(/^\d+$/)) {
                    return str;
                  }
                  name = JSON.stringify('' + key);
                  if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                    name = name.substr(1, name.length - 2);
                    name = ctx.stylize(name, 'name');
                  } else {
                    name = name
                      .replace(/'/g, "\\'")
                      .replace(/\\"/g, '"')
                      .replace(/(^"|"$)/g, "'");
                    name = ctx.stylize(name, 'string');
                  }
                }

                return name + ': ' + str;
              }

              function reduceToSingleString(output, base, braces) {
                var numLinesEst = 0;
                var length = output.reduce(function (prev, cur) {
                  numLinesEst++;
                  if (cur.indexOf('\n') >= 0) numLinesEst++;
                  return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
                }, 0);

                if (length > 60) {
                  return (
                    braces[0] +
                    (base === '' ? '' : base + '\n ') +
                    ' ' +
                    output.join(',\n  ') +
                    ' ' +
                    braces[1]
                  );
                }

                return (
                  braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1]
                );
              }

              // NOTE: These type checking functions intentionally don't use `instanceof`
              // because it is fragile and can be easily faked with `Object.create()`.
              function isArray(ar) {
                return Array.isArray(ar);
              }
              exports.isArray = isArray;

              function isBoolean(arg) {
                return typeof arg === 'boolean';
              }
              exports.isBoolean = isBoolean;

              function isNull(arg) {
                return arg === null;
              }
              exports.isNull = isNull;

              function isNullOrUndefined(arg) {
                return arg == null;
              }
              exports.isNullOrUndefined = isNullOrUndefined;

              function isNumber(arg) {
                return typeof arg === 'number';
              }
              exports.isNumber = isNumber;

              function isString(arg) {
                return typeof arg === 'string';
              }
              exports.isString = isString;

              function isSymbol(arg) {
                return typeof arg === 'symbol';
              }
              exports.isSymbol = isSymbol;

              function isUndefined(arg) {
                return arg === void 0;
              }
              exports.isUndefined = isUndefined;

              function isRegExp(re) {
                return isObject(re) && objectToString(re) === '[object RegExp]';
              }
              exports.isRegExp = isRegExp;

              function isObject(arg) {
                return typeof arg === 'object' && arg !== null;
              }
              exports.isObject = isObject;

              function isDate(d) {
                return isObject(d) && objectToString(d) === '[object Date]';
              }
              exports.isDate = isDate;

              function isError(e) {
                return (
                  isObject(e) &&
                  (objectToString(e) === '[object Error]' || e instanceof Error)
                );
              }
              exports.isError = isError;

              function isFunction(arg) {
                return typeof arg === 'function';
              }
              exports.isFunction = isFunction;

              function isPrimitive(arg) {
                return (
                  arg === null ||
                  typeof arg === 'boolean' ||
                  typeof arg === 'number' ||
                  typeof arg === 'string' ||
                  typeof arg === 'symbol' || // ES6 symbol
                  typeof arg === 'undefined'
                );
              }
              exports.isPrimitive = isPrimitive;

              exports.isBuffer = require('./support/isBuffer');

              function objectToString(o) {
                return Object.prototype.toString.call(o);
              }

              function pad(n) {
                return n < 10 ? '0' + n.toString(10) : n.toString(10);
              }

              var months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ];

              // 26 Feb 16:19:34
              function timestamp() {
                var d = new Date();
                var time = [
                  pad(d.getHours()),
                  pad(d.getMinutes()),
                  pad(d.getSeconds()),
                ].join(':');
                return [d.getDate(), months[d.getMonth()], time].join(' ');
              }

              // log is just a thin wrapper to console.log that prepends a timestamp
              exports.log = function () {
                console.log(
                  '%s - %s',
                  timestamp(),
                  exports.format.apply(exports, arguments)
                );
              };

              /**
               * Inherit the prototype methods from one constructor into another.
               *
               * The Function.prototype.inherits from lang.js rewritten as a standalone
               * function (not on Function.prototype). NOTE: If this file is to be loaded
               * during bootstrapping this function needs to be rewritten using some native
               * functions as prototype setup using normal JavaScript does not work as
               * expected during bootstrapping (see mirror.js in r114903).
               *
               * @param {function} ctor Constructor function which needs to inherit the
               *     prototype.
               * @param {function} superCtor Constructor function to inherit prototype from.
               */
              exports.inherits = require('inherits');

              exports._extend = function (origin, add) {
                // Don't do anything if add isn't an object
                if (!add || !isObject(add)) return origin;

                var keys = Object.keys(add);
                var i = keys.length;
                while (i--) {
                  origin[keys[i]] = add[keys[i]];
                }
                return origin;
              };

              function hasOwnProperty(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
              }
            }.call(this));
          }.call(
            this,
            require('_process'),
            typeof global !== 'undefined'
              ? global
              : typeof self !== 'undefined'
              ? self
              : typeof window !== 'undefined'
              ? window
              : {}
          ));
        },
        { './support/isBuffer': 3, _process: 13, inherits: 2 },
      ],
      5: [
        function (require, module, exports) {
          'use strict';

          exports.byteLength = byteLength;
          exports.toByteArray = toByteArray;
          exports.fromByteArray = fromByteArray;

          var lookup = [];
          var revLookup = [];
          var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

          var code =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
          for (var i = 0, len = code.length; i < len; ++i) {
            lookup[i] = code[i];
            revLookup[code.charCodeAt(i)] = i;
          }

          // Support decoding URL-safe base64 strings, as Node.js does.
          // See: https://en.wikipedia.org/wiki/Base64#URL_applications
          revLookup['-'.charCodeAt(0)] = 62;
          revLookup['_'.charCodeAt(0)] = 63;

          function getLens(b64) {
            var len = b64.length;

            if (len % 4 > 0) {
              throw new Error('Invalid string. Length must be a multiple of 4');
            }

            // Trim off extra bytes after placeholder bytes are found
            // See: https://github.com/beatgammit/base64-js/issues/42
            var validLen = b64.indexOf('=');
            if (validLen === -1) validLen = len;

            var placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);

            return [validLen, placeHoldersLen];
          }

          // base64 is 4/3 + up to two characters of the original data
          function byteLength(b64) {
            var lens = getLens(b64);
            var validLen = lens[0];
            var placeHoldersLen = lens[1];
            return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
          }

          function _byteLength(b64, validLen, placeHoldersLen) {
            return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
          }

          function toByteArray(b64) {
            var tmp;
            var lens = getLens(b64);
            var validLen = lens[0];
            var placeHoldersLen = lens[1];

            var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

            var curByte = 0;

            // if there are placeholders, only get up to the last complete 4 chars
            var len = placeHoldersLen > 0 ? validLen - 4 : validLen;

            var i;
            for (i = 0; i < len; i += 4) {
              tmp =
                (revLookup[b64.charCodeAt(i)] << 18) |
                (revLookup[b64.charCodeAt(i + 1)] << 12) |
                (revLookup[b64.charCodeAt(i + 2)] << 6) |
                revLookup[b64.charCodeAt(i + 3)];
              arr[curByte++] = (tmp >> 16) & 0xff;
              arr[curByte++] = (tmp >> 8) & 0xff;
              arr[curByte++] = tmp & 0xff;
            }

            if (placeHoldersLen === 2) {
              tmp =
                (revLookup[b64.charCodeAt(i)] << 2) |
                (revLookup[b64.charCodeAt(i + 1)] >> 4);
              arr[curByte++] = tmp & 0xff;
            }

            if (placeHoldersLen === 1) {
              tmp =
                (revLookup[b64.charCodeAt(i)] << 10) |
                (revLookup[b64.charCodeAt(i + 1)] << 4) |
                (revLookup[b64.charCodeAt(i + 2)] >> 2);
              arr[curByte++] = (tmp >> 8) & 0xff;
              arr[curByte++] = tmp & 0xff;
            }

            return arr;
          }

          function tripletToBase64(num) {
            return (
              lookup[(num >> 18) & 0x3f] +
              lookup[(num >> 12) & 0x3f] +
              lookup[(num >> 6) & 0x3f] +
              lookup[num & 0x3f]
            );
          }

          function encodeChunk(uint8, start, end) {
            var tmp;
            var output = [];
            for (var i = start; i < end; i += 3) {
              tmp =
                ((uint8[i] << 16) & 0xff0000) +
                ((uint8[i + 1] << 8) & 0xff00) +
                (uint8[i + 2] & 0xff);
              output.push(tripletToBase64(tmp));
            }
            return output.join('');
          }

          function fromByteArray(uint8) {
            var tmp;
            var len = uint8.length;
            var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
            var parts = [];
            var maxChunkLength = 16383; // must be multiple of 3

            // go through the array every three bytes, we'll deal with trailing stuff later
            for (
              var i = 0, len2 = len - extraBytes;
              i < len2;
              i += maxChunkLength
            ) {
              parts.push(
                encodeChunk(
                  uint8,
                  i,
                  i + maxChunkLength > len2 ? len2 : i + maxChunkLength
                )
              );
            }

            // pad the end with zeros, but make sure to not forget the extra bytes
            if (extraBytes === 1) {
              tmp = uint8[len - 1];
              parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f] + '==');
            } else if (extraBytes === 2) {
              tmp = (uint8[len - 2] << 8) + uint8[len - 1];
              parts.push(
                lookup[tmp >> 10] +
                  lookup[(tmp >> 4) & 0x3f] +
                  lookup[(tmp << 2) & 0x3f] +
                  '='
              );
            }

            return parts.join('');
          }
        },
        {},
      ],
      6: [function (require, module, exports) {}, {}],
      7: [
        function (require, module, exports) {
          (function (Buffer) {
            (function () {
              /*!
               * The buffer module from node.js, for the browser.
               *
               * @author   Feross Aboukhadijeh <https://feross.org>
               * @license  MIT
               */
              /* eslint-disable no-proto */

              'use strict';

              var base64 = require('base64-js');
              var ieee754 = require('ieee754');

              exports.Buffer = Buffer;
              exports.SlowBuffer = SlowBuffer;
              exports.INSPECT_MAX_BYTES = 50;

              var K_MAX_LENGTH = 0x7fffffff;
              exports.kMaxLength = K_MAX_LENGTH;

              /**
               * If `Buffer.TYPED_ARRAY_SUPPORT`:
               *   === true    Use Uint8Array implementation (fastest)
               *   === false   Print warning and recommend using `buffer` v4.x which has an Object
               *               implementation (most compatible, even IE6)
               *
               * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
               * Opera 11.6+, iOS 4.2+.
               *
               * We report that the browser does not support typed arrays if the are not subclassable
               * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
               * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
               * for __proto__ and has a buggy typed array implementation.
               */
              Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

              if (
                !Buffer.TYPED_ARRAY_SUPPORT &&
                typeof console !== 'undefined' &&
                typeof console.error === 'function'
              ) {
                console.error(
                  'This browser lacks typed array (Uint8Array) support which is required by ' +
                    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
                );
              }

              function typedArraySupport() {
                // Can typed array instances can be augmented?
                try {
                  var arr = new Uint8Array(1);
                  arr.__proto__ = {
                    __proto__: Uint8Array.prototype,
                    foo: function () {
                      return 42;
                    },
                  };
                  return arr.foo() === 42;
                } catch (e) {
                  return false;
                }
              }

              Object.defineProperty(Buffer.prototype, 'parent', {
                enumerable: true,
                get: function () {
                  if (!Buffer.isBuffer(this)) return undefined;
                  return this.buffer;
                },
              });

              Object.defineProperty(Buffer.prototype, 'offset', {
                enumerable: true,
                get: function () {
                  if (!Buffer.isBuffer(this)) return undefined;
                  return this.byteOffset;
                },
              });

              function createBuffer(length) {
                if (length > K_MAX_LENGTH) {
                  throw new RangeError(
                    'The value "' + length + '" is invalid for option "size"'
                  );
                }
                // Return an augmented `Uint8Array` instance
                var buf = new Uint8Array(length);
                buf.__proto__ = Buffer.prototype;
                return buf;
              }

              /**
               * The Buffer constructor returns instances of `Uint8Array` that have their
               * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
               * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
               * and the `Uint8Array` methods. Square bracket notation works as expected -- it
               * returns a single octet.
               *
               * The `Uint8Array` prototype remains unmodified.
               */

              function Buffer(arg, encodingOrOffset, length) {
                // Common case.
                if (typeof arg === 'number') {
                  if (typeof encodingOrOffset === 'string') {
                    throw new TypeError(
                      'The "string" argument must be of type string. Received type number'
                    );
                  }
                  return allocUnsafe(arg);
                }
                return from(arg, encodingOrOffset, length);
              }

              // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
              if (
                typeof Symbol !== 'undefined' &&
                Symbol.species != null &&
                Buffer[Symbol.species] === Buffer
              ) {
                Object.defineProperty(Buffer, Symbol.species, {
                  value: null,
                  configurable: true,
                  enumerable: false,
                  writable: false,
                });
              }

              Buffer.poolSize = 8192; // not used by this implementation

              function from(value, encodingOrOffset, length) {
                if (typeof value === 'string') {
                  return fromString(value, encodingOrOffset);
                }

                if (ArrayBuffer.isView(value)) {
                  return fromArrayLike(value);
                }

                if (value == null) {
                  throw TypeError(
                    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
                      'or Array-like Object. Received type ' +
                      typeof value
                  );
                }

                if (
                  isInstance(value, ArrayBuffer) ||
                  (value && isInstance(value.buffer, ArrayBuffer))
                ) {
                  return fromArrayBuffer(value, encodingOrOffset, length);
                }

                if (typeof value === 'number') {
                  throw new TypeError(
                    'The "value" argument must not be of type number. Received type number'
                  );
                }

                var valueOf = value.valueOf && value.valueOf();
                if (valueOf != null && valueOf !== value) {
                  return Buffer.from(valueOf, encodingOrOffset, length);
                }

                var b = fromObject(value);
                if (b) return b;

                if (
                  typeof Symbol !== 'undefined' &&
                  Symbol.toPrimitive != null &&
                  typeof value[Symbol.toPrimitive] === 'function'
                ) {
                  return Buffer.from(
                    value[Symbol.toPrimitive]('string'),
                    encodingOrOffset,
                    length
                  );
                }

                throw new TypeError(
                  'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
                    'or Array-like Object. Received type ' +
                    typeof value
                );
              }

              /**
               * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
               * if value is a number.
               * Buffer.from(str[, encoding])
               * Buffer.from(array)
               * Buffer.from(buffer)
               * Buffer.from(arrayBuffer[, byteOffset[, length]])
               **/
              Buffer.from = function (value, encodingOrOffset, length) {
                return from(value, encodingOrOffset, length);
              };

              // Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
              // https://github.com/feross/buffer/pull/148
              Buffer.prototype.__proto__ = Uint8Array.prototype;
              Buffer.__proto__ = Uint8Array;

              function assertSize(size) {
                if (typeof size !== 'number') {
                  throw new TypeError('"size" argument must be of type number');
                } else if (size < 0) {
                  throw new RangeError(
                    'The value "' + size + '" is invalid for option "size"'
                  );
                }
              }

              function alloc(size, fill, encoding) {
                assertSize(size);
                if (size <= 0) {
                  return createBuffer(size);
                }
                if (fill !== undefined) {
                  // Only pay attention to encoding if it's a string. This
                  // prevents accidentally sending in a number that would
                  // be interpretted as a start offset.
                  return typeof encoding === 'string'
                    ? createBuffer(size).fill(fill, encoding)
                    : createBuffer(size).fill(fill);
                }
                return createBuffer(size);
              }

              /**
               * Creates a new filled Buffer instance.
               * alloc(size[, fill[, encoding]])
               **/
              Buffer.alloc = function (size, fill, encoding) {
                return alloc(size, fill, encoding);
              };

              function allocUnsafe(size) {
                assertSize(size);
                return createBuffer(size < 0 ? 0 : checked(size) | 0);
              }

              /**
               * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
               * */
              Buffer.allocUnsafe = function (size) {
                return allocUnsafe(size);
              };
              /**
               * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
               */
              Buffer.allocUnsafeSlow = function (size) {
                return allocUnsafe(size);
              };

              function fromString(string, encoding) {
                if (typeof encoding !== 'string' || encoding === '') {
                  encoding = 'utf8';
                }

                if (!Buffer.isEncoding(encoding)) {
                  throw new TypeError('Unknown encoding: ' + encoding);
                }

                var length = byteLength(string, encoding) | 0;
                var buf = createBuffer(length);

                var actual = buf.write(string, encoding);

                if (actual !== length) {
                  // Writing a hex string, for example, that contains invalid characters will
                  // cause everything after the first invalid character to be ignored. (e.g.
                  // 'abxxcd' will be treated as 'ab')
                  buf = buf.slice(0, actual);
                }

                return buf;
              }

              function fromArrayLike(array) {
                var length = array.length < 0 ? 0 : checked(array.length) | 0;
                var buf = createBuffer(length);
                for (var i = 0; i < length; i += 1) {
                  buf[i] = array[i] & 255;
                }
                return buf;
              }

              function fromArrayBuffer(array, byteOffset, length) {
                if (byteOffset < 0 || array.byteLength < byteOffset) {
                  throw new RangeError('"offset" is outside of buffer bounds');
                }

                if (array.byteLength < byteOffset + (length || 0)) {
                  throw new RangeError('"length" is outside of buffer bounds');
                }

                var buf;
                if (byteOffset === undefined && length === undefined) {
                  buf = new Uint8Array(array);
                } else if (length === undefined) {
                  buf = new Uint8Array(array, byteOffset);
                } else {
                  buf = new Uint8Array(array, byteOffset, length);
                }

                // Return an augmented `Uint8Array` instance
                buf.__proto__ = Buffer.prototype;
                return buf;
              }

              function fromObject(obj) {
                if (Buffer.isBuffer(obj)) {
                  var len = checked(obj.length) | 0;
                  var buf = createBuffer(len);

                  if (buf.length === 0) {
                    return buf;
                  }

                  obj.copy(buf, 0, 0, len);
                  return buf;
                }

                if (obj.length !== undefined) {
                  if (
                    typeof obj.length !== 'number' ||
                    numberIsNaN(obj.length)
                  ) {
                    return createBuffer(0);
                  }
                  return fromArrayLike(obj);
                }

                if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
                  return fromArrayLike(obj.data);
                }
              }

              function checked(length) {
                // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
                // length is NaN (which is otherwise coerced to zero.)
                if (length >= K_MAX_LENGTH) {
                  throw new RangeError(
                    'Attempt to allocate Buffer larger than maximum ' +
                      'size: 0x' +
                      K_MAX_LENGTH.toString(16) +
                      ' bytes'
                  );
                }
                return length | 0;
              }

              function SlowBuffer(length) {
                if (+length != length) {
                  // eslint-disable-line eqeqeq
                  length = 0;
                }
                return Buffer.alloc(+length);
              }

              Buffer.isBuffer = function isBuffer(b) {
                return (
                  b != null && b._isBuffer === true && b !== Buffer.prototype
                ); // so Buffer.isBuffer(Buffer.prototype) will be false
              };

              Buffer.compare = function compare(a, b) {
                if (isInstance(a, Uint8Array))
                  a = Buffer.from(a, a.offset, a.byteLength);
                if (isInstance(b, Uint8Array))
                  b = Buffer.from(b, b.offset, b.byteLength);
                if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
                  throw new TypeError(
                    'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
                  );
                }

                if (a === b) return 0;

                var x = a.length;
                var y = b.length;

                for (var i = 0, len = Math.min(x, y); i < len; ++i) {
                  if (a[i] !== b[i]) {
                    x = a[i];
                    y = b[i];
                    break;
                  }
                }

                if (x < y) return -1;
                if (y < x) return 1;
                return 0;
              };

              Buffer.isEncoding = function isEncoding(encoding) {
                switch (String(encoding).toLowerCase()) {
                  case 'hex':
                  case 'utf8':
                  case 'utf-8':
                  case 'ascii':
                  case 'latin1':
                  case 'binary':
                  case 'base64':
                  case 'ucs2':
                  case 'ucs-2':
                  case 'utf16le':
                  case 'utf-16le':
                    return true;
                  default:
                    return false;
                }
              };

              Buffer.concat = function concat(list, length) {
                if (!Array.isArray(list)) {
                  throw new TypeError(
                    '"list" argument must be an Array of Buffers'
                  );
                }

                if (list.length === 0) {
                  return Buffer.alloc(0);
                }

                var i;
                if (length === undefined) {
                  length = 0;
                  for (i = 0; i < list.length; ++i) {
                    length += list[i].length;
                  }
                }

                var buffer = Buffer.allocUnsafe(length);
                var pos = 0;
                for (i = 0; i < list.length; ++i) {
                  var buf = list[i];
                  if (isInstance(buf, Uint8Array)) {
                    buf = Buffer.from(buf);
                  }
                  if (!Buffer.isBuffer(buf)) {
                    throw new TypeError(
                      '"list" argument must be an Array of Buffers'
                    );
                  }
                  buf.copy(buffer, pos);
                  pos += buf.length;
                }
                return buffer;
              };

              function byteLength(string, encoding) {
                if (Buffer.isBuffer(string)) {
                  return string.length;
                }
                if (
                  ArrayBuffer.isView(string) ||
                  isInstance(string, ArrayBuffer)
                ) {
                  return string.byteLength;
                }
                if (typeof string !== 'string') {
                  throw new TypeError(
                    'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
                      'Received type ' +
                      typeof string
                  );
                }

                var len = string.length;
                var mustMatch = arguments.length > 2 && arguments[2] === true;
                if (!mustMatch && len === 0) return 0;

                // Use a for loop to avoid recursion
                var loweredCase = false;
                for (;;) {
                  switch (encoding) {
                    case 'ascii':
                    case 'latin1':
                    case 'binary':
                      return len;
                    case 'utf8':
                    case 'utf-8':
                      return utf8ToBytes(string).length;
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return len * 2;
                    case 'hex':
                      return len >>> 1;
                    case 'base64':
                      return base64ToBytes(string).length;
                    default:
                      if (loweredCase) {
                        return mustMatch ? -1 : utf8ToBytes(string).length; // assume utf8
                      }
                      encoding = ('' + encoding).toLowerCase();
                      loweredCase = true;
                  }
                }
              }
              Buffer.byteLength = byteLength;

              function slowToString(encoding, start, end) {
                var loweredCase = false;

                // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
                // property of a typed array.

                // This behaves neither like String nor Uint8Array in that we set start/end
                // to their upper/lower bounds if the value passed is out of range.
                // undefined is handled specially as per ECMA-262 6th Edition,
                // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
                if (start === undefined || start < 0) {
                  start = 0;
                }
                // Return early if start > this.length. Done here to prevent potential uint32
                // coercion fail below.
                if (start > this.length) {
                  return '';
                }

                if (end === undefined || end > this.length) {
                  end = this.length;
                }

                if (end <= 0) {
                  return '';
                }

                // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
                end >>>= 0;
                start >>>= 0;

                if (end <= start) {
                  return '';
                }

                if (!encoding) encoding = 'utf8';

                while (true) {
                  switch (encoding) {
                    case 'hex':
                      return hexSlice(this, start, end);

                    case 'utf8':
                    case 'utf-8':
                      return utf8Slice(this, start, end);

                    case 'ascii':
                      return asciiSlice(this, start, end);

                    case 'latin1':
                    case 'binary':
                      return latin1Slice(this, start, end);

                    case 'base64':
                      return base64Slice(this, start, end);

                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return utf16leSlice(this, start, end);

                    default:
                      if (loweredCase)
                        throw new TypeError('Unknown encoding: ' + encoding);
                      encoding = (encoding + '').toLowerCase();
                      loweredCase = true;
                  }
                }
              }

              // This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
              // to detect a Buffer instance. It's not possible to use `instanceof Buffer`
              // reliably in a browserify context because there could be multiple different
              // copies of the 'buffer' package in use. This method works even for Buffer
              // instances that were created from another copy of the `buffer` package.
              // See: https://github.com/feross/buffer/issues/154
              Buffer.prototype._isBuffer = true;

              function swap(b, n, m) {
                var i = b[n];
                b[n] = b[m];
                b[m] = i;
              }

              Buffer.prototype.swap16 = function swap16() {
                var len = this.length;
                if (len % 2 !== 0) {
                  throw new RangeError(
                    'Buffer size must be a multiple of 16-bits'
                  );
                }
                for (var i = 0; i < len; i += 2) {
                  swap(this, i, i + 1);
                }
                return this;
              };

              Buffer.prototype.swap32 = function swap32() {
                var len = this.length;
                if (len % 4 !== 0) {
                  throw new RangeError(
                    'Buffer size must be a multiple of 32-bits'
                  );
                }
                for (var i = 0; i < len; i += 4) {
                  swap(this, i, i + 3);
                  swap(this, i + 1, i + 2);
                }
                return this;
              };

              Buffer.prototype.swap64 = function swap64() {
                var len = this.length;
                if (len % 8 !== 0) {
                  throw new RangeError(
                    'Buffer size must be a multiple of 64-bits'
                  );
                }
                for (var i = 0; i < len; i += 8) {
                  swap(this, i, i + 7);
                  swap(this, i + 1, i + 6);
                  swap(this, i + 2, i + 5);
                  swap(this, i + 3, i + 4);
                }
                return this;
              };

              Buffer.prototype.toString = function toString() {
                var length = this.length;
                if (length === 0) return '';
                if (arguments.length === 0) return utf8Slice(this, 0, length);
                return slowToString.apply(this, arguments);
              };

              Buffer.prototype.toLocaleString = Buffer.prototype.toString;

              Buffer.prototype.equals = function equals(b) {
                if (!Buffer.isBuffer(b))
                  throw new TypeError('Argument must be a Buffer');
                if (this === b) return true;
                return Buffer.compare(this, b) === 0;
              };

              Buffer.prototype.inspect = function inspect() {
                var str = '';
                var max = exports.INSPECT_MAX_BYTES;
                str = this.toString('hex', 0, max)
                  .replace(/(.{2})/g, '$1 ')
                  .trim();
                if (this.length > max) str += ' ... ';
                return '<Buffer ' + str + '>';
              };

              Buffer.prototype.compare = function compare(
                target,
                start,
                end,
                thisStart,
                thisEnd
              ) {
                if (isInstance(target, Uint8Array)) {
                  target = Buffer.from(
                    target,
                    target.offset,
                    target.byteLength
                  );
                }
                if (!Buffer.isBuffer(target)) {
                  throw new TypeError(
                    'The "target" argument must be one of type Buffer or Uint8Array. ' +
                      'Received type ' +
                      typeof target
                  );
                }

                if (start === undefined) {
                  start = 0;
                }
                if (end === undefined) {
                  end = target ? target.length : 0;
                }
                if (thisStart === undefined) {
                  thisStart = 0;
                }
                if (thisEnd === undefined) {
                  thisEnd = this.length;
                }

                if (
                  start < 0 ||
                  end > target.length ||
                  thisStart < 0 ||
                  thisEnd > this.length
                ) {
                  throw new RangeError('out of range index');
                }

                if (thisStart >= thisEnd && start >= end) {
                  return 0;
                }
                if (thisStart >= thisEnd) {
                  return -1;
                }
                if (start >= end) {
                  return 1;
                }

                start >>>= 0;
                end >>>= 0;
                thisStart >>>= 0;
                thisEnd >>>= 0;

                if (this === target) return 0;

                var x = thisEnd - thisStart;
                var y = end - start;
                var len = Math.min(x, y);

                var thisCopy = this.slice(thisStart, thisEnd);
                var targetCopy = target.slice(start, end);

                for (var i = 0; i < len; ++i) {
                  if (thisCopy[i] !== targetCopy[i]) {
                    x = thisCopy[i];
                    y = targetCopy[i];
                    break;
                  }
                }

                if (x < y) return -1;
                if (y < x) return 1;
                return 0;
              };

              // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
              // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
              //
              // Arguments:
              // - buffer - a Buffer to search
              // - val - a string, Buffer, or number
              // - byteOffset - an index into `buffer`; will be clamped to an int32
              // - encoding - an optional encoding, relevant is val is a string
              // - dir - true for indexOf, false for lastIndexOf
              function bidirectionalIndexOf(
                buffer,
                val,
                byteOffset,
                encoding,
                dir
              ) {
                // Empty buffer means no match
                if (buffer.length === 0) return -1;

                // Normalize byteOffset
                if (typeof byteOffset === 'string') {
                  encoding = byteOffset;
                  byteOffset = 0;
                } else if (byteOffset > 0x7fffffff) {
                  byteOffset = 0x7fffffff;
                } else if (byteOffset < -0x80000000) {
                  byteOffset = -0x80000000;
                }
                byteOffset = +byteOffset; // Coerce to Number.
                if (numberIsNaN(byteOffset)) {
                  // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
                  byteOffset = dir ? 0 : buffer.length - 1;
                }

                // Normalize byteOffset: negative offsets start from the end of the buffer
                if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
                if (byteOffset >= buffer.length) {
                  if (dir) return -1;
                  else byteOffset = buffer.length - 1;
                } else if (byteOffset < 0) {
                  if (dir) byteOffset = 0;
                  else return -1;
                }

                // Normalize val
                if (typeof val === 'string') {
                  val = Buffer.from(val, encoding);
                }

                // Finally, search either indexOf (if dir is true) or lastIndexOf
                if (Buffer.isBuffer(val)) {
                  // Special case: looking for empty string/buffer always fails
                  if (val.length === 0) {
                    return -1;
                  }
                  return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
                } else if (typeof val === 'number') {
                  val = val & 0xff; // Search for a byte value [0-255]
                  if (typeof Uint8Array.prototype.indexOf === 'function') {
                    if (dir) {
                      return Uint8Array.prototype.indexOf.call(
                        buffer,
                        val,
                        byteOffset
                      );
                    } else {
                      return Uint8Array.prototype.lastIndexOf.call(
                        buffer,
                        val,
                        byteOffset
                      );
                    }
                  }
                  return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
                }

                throw new TypeError('val must be string, number or Buffer');
              }

              function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
                var indexSize = 1;
                var arrLength = arr.length;
                var valLength = val.length;

                if (encoding !== undefined) {
                  encoding = String(encoding).toLowerCase();
                  if (
                    encoding === 'ucs2' ||
                    encoding === 'ucs-2' ||
                    encoding === 'utf16le' ||
                    encoding === 'utf-16le'
                  ) {
                    if (arr.length < 2 || val.length < 2) {
                      return -1;
                    }
                    indexSize = 2;
                    arrLength /= 2;
                    valLength /= 2;
                    byteOffset /= 2;
                  }
                }

                function read(buf, i) {
                  if (indexSize === 1) {
                    return buf[i];
                  } else {
                    return buf.readUInt16BE(i * indexSize);
                  }
                }

                var i;
                if (dir) {
                  var foundIndex = -1;
                  for (i = byteOffset; i < arrLength; i++) {
                    if (
                      read(arr, i) ===
                      read(val, foundIndex === -1 ? 0 : i - foundIndex)
                    ) {
                      if (foundIndex === -1) foundIndex = i;
                      if (i - foundIndex + 1 === valLength)
                        return foundIndex * indexSize;
                    } else {
                      if (foundIndex !== -1) i -= i - foundIndex;
                      foundIndex = -1;
                    }
                  }
                } else {
                  if (byteOffset + valLength > arrLength)
                    byteOffset = arrLength - valLength;
                  for (i = byteOffset; i >= 0; i--) {
                    var found = true;
                    for (var j = 0; j < valLength; j++) {
                      if (read(arr, i + j) !== read(val, j)) {
                        found = false;
                        break;
                      }
                    }
                    if (found) return i;
                  }
                }

                return -1;
              }

              Buffer.prototype.includes = function includes(
                val,
                byteOffset,
                encoding
              ) {
                return this.indexOf(val, byteOffset, encoding) !== -1;
              };

              Buffer.prototype.indexOf = function indexOf(
                val,
                byteOffset,
                encoding
              ) {
                return bidirectionalIndexOf(
                  this,
                  val,
                  byteOffset,
                  encoding,
                  true
                );
              };

              Buffer.prototype.lastIndexOf = function lastIndexOf(
                val,
                byteOffset,
                encoding
              ) {
                return bidirectionalIndexOf(
                  this,
                  val,
                  byteOffset,
                  encoding,
                  false
                );
              };

              function hexWrite(buf, string, offset, length) {
                offset = Number(offset) || 0;
                var remaining = buf.length - offset;
                if (!length) {
                  length = remaining;
                } else {
                  length = Number(length);
                  if (length > remaining) {
                    length = remaining;
                  }
                }

                var strLen = string.length;

                if (length > strLen / 2) {
                  length = strLen / 2;
                }
                for (var i = 0; i < length; ++i) {
                  var parsed = parseInt(string.substr(i * 2, 2), 16);
                  if (numberIsNaN(parsed)) return i;
                  buf[offset + i] = parsed;
                }
                return i;
              }

              function utf8Write(buf, string, offset, length) {
                return blitBuffer(
                  utf8ToBytes(string, buf.length - offset),
                  buf,
                  offset,
                  length
                );
              }

              function asciiWrite(buf, string, offset, length) {
                return blitBuffer(asciiToBytes(string), buf, offset, length);
              }

              function latin1Write(buf, string, offset, length) {
                return asciiWrite(buf, string, offset, length);
              }

              function base64Write(buf, string, offset, length) {
                return blitBuffer(base64ToBytes(string), buf, offset, length);
              }

              function ucs2Write(buf, string, offset, length) {
                return blitBuffer(
                  utf16leToBytes(string, buf.length - offset),
                  buf,
                  offset,
                  length
                );
              }

              Buffer.prototype.write = function write(
                string,
                offset,
                length,
                encoding
              ) {
                // Buffer#write(string)
                if (offset === undefined) {
                  encoding = 'utf8';
                  length = this.length;
                  offset = 0;
                  // Buffer#write(string, encoding)
                } else if (length === undefined && typeof offset === 'string') {
                  encoding = offset;
                  length = this.length;
                  offset = 0;
                  // Buffer#write(string, offset[, length][, encoding])
                } else if (isFinite(offset)) {
                  offset = offset >>> 0;
                  if (isFinite(length)) {
                    length = length >>> 0;
                    if (encoding === undefined) encoding = 'utf8';
                  } else {
                    encoding = length;
                    length = undefined;
                  }
                } else {
                  throw new Error(
                    'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                  );
                }

                var remaining = this.length - offset;
                if (length === undefined || length > remaining)
                  length = remaining;

                if (
                  (string.length > 0 && (length < 0 || offset < 0)) ||
                  offset > this.length
                ) {
                  throw new RangeError(
                    'Attempt to write outside buffer bounds'
                  );
                }

                if (!encoding) encoding = 'utf8';

                var loweredCase = false;
                for (;;) {
                  switch (encoding) {
                    case 'hex':
                      return hexWrite(this, string, offset, length);

                    case 'utf8':
                    case 'utf-8':
                      return utf8Write(this, string, offset, length);

                    case 'ascii':
                      return asciiWrite(this, string, offset, length);

                    case 'latin1':
                    case 'binary':
                      return latin1Write(this, string, offset, length);

                    case 'base64':
                      // Warning: maxLength not taken into account in base64Write
                      return base64Write(this, string, offset, length);

                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return ucs2Write(this, string, offset, length);

                    default:
                      if (loweredCase)
                        throw new TypeError('Unknown encoding: ' + encoding);
                      encoding = ('' + encoding).toLowerCase();
                      loweredCase = true;
                  }
                }
              };

              Buffer.prototype.toJSON = function toJSON() {
                return {
                  type: 'Buffer',
                  data: Array.prototype.slice.call(this._arr || this, 0),
                };
              };

              function base64Slice(buf, start, end) {
                if (start === 0 && end === buf.length) {
                  return base64.fromByteArray(buf);
                } else {
                  return base64.fromByteArray(buf.slice(start, end));
                }
              }

              function utf8Slice(buf, start, end) {
                end = Math.min(buf.length, end);
                var res = [];

                var i = start;
                while (i < end) {
                  var firstByte = buf[i];
                  var codePoint = null;
                  var bytesPerSequence =
                    firstByte > 0xef
                      ? 4
                      : firstByte > 0xdf
                      ? 3
                      : firstByte > 0xbf
                      ? 2
                      : 1;

                  if (i + bytesPerSequence <= end) {
                    var secondByte, thirdByte, fourthByte, tempCodePoint;

                    switch (bytesPerSequence) {
                      case 1:
                        if (firstByte < 0x80) {
                          codePoint = firstByte;
                        }
                        break;
                      case 2:
                        secondByte = buf[i + 1];
                        if ((secondByte & 0xc0) === 0x80) {
                          tempCodePoint =
                            ((firstByte & 0x1f) << 0x6) | (secondByte & 0x3f);
                          if (tempCodePoint > 0x7f) {
                            codePoint = tempCodePoint;
                          }
                        }
                        break;
                      case 3:
                        secondByte = buf[i + 1];
                        thirdByte = buf[i + 2];
                        if (
                          (secondByte & 0xc0) === 0x80 &&
                          (thirdByte & 0xc0) === 0x80
                        ) {
                          tempCodePoint =
                            ((firstByte & 0xf) << 0xc) |
                            ((secondByte & 0x3f) << 0x6) |
                            (thirdByte & 0x3f);
                          if (
                            tempCodePoint > 0x7ff &&
                            (tempCodePoint < 0xd800 || tempCodePoint > 0xdfff)
                          ) {
                            codePoint = tempCodePoint;
                          }
                        }
                        break;
                      case 4:
                        secondByte = buf[i + 1];
                        thirdByte = buf[i + 2];
                        fourthByte = buf[i + 3];
                        if (
                          (secondByte & 0xc0) === 0x80 &&
                          (thirdByte & 0xc0) === 0x80 &&
                          (fourthByte & 0xc0) === 0x80
                        ) {
                          tempCodePoint =
                            ((firstByte & 0xf) << 0x12) |
                            ((secondByte & 0x3f) << 0xc) |
                            ((thirdByte & 0x3f) << 0x6) |
                            (fourthByte & 0x3f);
                          if (
                            tempCodePoint > 0xffff &&
                            tempCodePoint < 0x110000
                          ) {
                            codePoint = tempCodePoint;
                          }
                        }
                    }
                  }

                  if (codePoint === null) {
                    // we did not generate a valid codePoint so insert a
                    // replacement char (U+FFFD) and advance only 1 byte
                    codePoint = 0xfffd;
                    bytesPerSequence = 1;
                  } else if (codePoint > 0xffff) {
                    // encode to utf16 (surrogate pair dance)
                    codePoint -= 0x10000;
                    res.push(((codePoint >>> 10) & 0x3ff) | 0xd800);
                    codePoint = 0xdc00 | (codePoint & 0x3ff);
                  }

                  res.push(codePoint);
                  i += bytesPerSequence;
                }

                return decodeCodePointsArray(res);
              }

              // Based on http://stackoverflow.com/a/22747272/680742, the browser with
              // the lowest limit is Chrome, with 0x10000 args.
              // We go 1 magnitude less, for safety
              var MAX_ARGUMENTS_LENGTH = 0x1000;

              function decodeCodePointsArray(codePoints) {
                var len = codePoints.length;
                if (len <= MAX_ARGUMENTS_LENGTH) {
                  return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
                }

                // Decode in chunks to avoid "call stack size exceeded".
                var res = '';
                var i = 0;
                while (i < len) {
                  res += String.fromCharCode.apply(
                    String,
                    codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH))
                  );
                }
                return res;
              }

              function asciiSlice(buf, start, end) {
                var ret = '';
                end = Math.min(buf.length, end);

                for (var i = start; i < end; ++i) {
                  ret += String.fromCharCode(buf[i] & 0x7f);
                }
                return ret;
              }

              function latin1Slice(buf, start, end) {
                var ret = '';
                end = Math.min(buf.length, end);

                for (var i = start; i < end; ++i) {
                  ret += String.fromCharCode(buf[i]);
                }
                return ret;
              }

              function hexSlice(buf, start, end) {
                var len = buf.length;

                if (!start || start < 0) start = 0;
                if (!end || end < 0 || end > len) end = len;

                var out = '';
                for (var i = start; i < end; ++i) {
                  out += toHex(buf[i]);
                }
                return out;
              }

              function utf16leSlice(buf, start, end) {
                var bytes = buf.slice(start, end);
                var res = '';
                for (var i = 0; i < bytes.length; i += 2) {
                  res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
                }
                return res;
              }

              Buffer.prototype.slice = function slice(start, end) {
                var len = this.length;
                start = ~~start;
                end = end === undefined ? len : ~~end;

                if (start < 0) {
                  start += len;
                  if (start < 0) start = 0;
                } else if (start > len) {
                  start = len;
                }

                if (end < 0) {
                  end += len;
                  if (end < 0) end = 0;
                } else if (end > len) {
                  end = len;
                }

                if (end < start) end = start;

                var newBuf = this.subarray(start, end);
                // Return an augmented `Uint8Array` instance
                newBuf.__proto__ = Buffer.prototype;
                return newBuf;
              };

              /*
               * Need to make sure that buffer isn't trying to write out of bounds.
               */
              function checkOffset(offset, ext, length) {
                if (offset % 1 !== 0 || offset < 0)
                  throw new RangeError('offset is not uint');
                if (offset + ext > length)
                  throw new RangeError('Trying to access beyond buffer length');
              }

              Buffer.prototype.readUIntLE = function readUIntLE(
                offset,
                byteLength,
                noAssert
              ) {
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) checkOffset(offset, byteLength, this.length);

                var val = this[offset];
                var mul = 1;
                var i = 0;
                while (++i < byteLength && (mul *= 0x100)) {
                  val += this[offset + i] * mul;
                }

                return val;
              };

              Buffer.prototype.readUIntBE = function readUIntBE(
                offset,
                byteLength,
                noAssert
              ) {
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) {
                  checkOffset(offset, byteLength, this.length);
                }

                var val = this[offset + --byteLength];
                var mul = 1;
                while (byteLength > 0 && (mul *= 0x100)) {
                  val += this[offset + --byteLength] * mul;
                }

                return val;
              };

              Buffer.prototype.readUInt8 = function readUInt8(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 1, this.length);
                return this[offset];
              };

              Buffer.prototype.readUInt16LE = function readUInt16LE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 2, this.length);
                return this[offset] | (this[offset + 1] << 8);
              };

              Buffer.prototype.readUInt16BE = function readUInt16BE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 2, this.length);
                return (this[offset] << 8) | this[offset + 1];
              };

              Buffer.prototype.readUInt32LE = function readUInt32LE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);

                return (
                  (this[offset] |
                    (this[offset + 1] << 8) |
                    (this[offset + 2] << 16)) +
                  this[offset + 3] * 0x1000000
                );
              };

              Buffer.prototype.readUInt32BE = function readUInt32BE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);

                return (
                  this[offset] * 0x1000000 +
                  ((this[offset + 1] << 16) |
                    (this[offset + 2] << 8) |
                    this[offset + 3])
                );
              };

              Buffer.prototype.readIntLE = function readIntLE(
                offset,
                byteLength,
                noAssert
              ) {
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) checkOffset(offset, byteLength, this.length);

                var val = this[offset];
                var mul = 1;
                var i = 0;
                while (++i < byteLength && (mul *= 0x100)) {
                  val += this[offset + i] * mul;
                }
                mul *= 0x80;

                if (val >= mul) val -= Math.pow(2, 8 * byteLength);

                return val;
              };

              Buffer.prototype.readIntBE = function readIntBE(
                offset,
                byteLength,
                noAssert
              ) {
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) checkOffset(offset, byteLength, this.length);

                var i = byteLength;
                var mul = 1;
                var val = this[offset + --i];
                while (i > 0 && (mul *= 0x100)) {
                  val += this[offset + --i] * mul;
                }
                mul *= 0x80;

                if (val >= mul) val -= Math.pow(2, 8 * byteLength);

                return val;
              };

              Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 1, this.length);
                if (!(this[offset] & 0x80)) return this[offset];
                return (0xff - this[offset] + 1) * -1;
              };

              Buffer.prototype.readInt16LE = function readInt16LE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 2, this.length);
                var val = this[offset] | (this[offset + 1] << 8);
                return val & 0x8000 ? val | 0xffff0000 : val;
              };

              Buffer.prototype.readInt16BE = function readInt16BE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 2, this.length);
                var val = this[offset + 1] | (this[offset] << 8);
                return val & 0x8000 ? val | 0xffff0000 : val;
              };

              Buffer.prototype.readInt32LE = function readInt32LE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);

                return (
                  this[offset] |
                  (this[offset + 1] << 8) |
                  (this[offset + 2] << 16) |
                  (this[offset + 3] << 24)
                );
              };

              Buffer.prototype.readInt32BE = function readInt32BE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);

                return (
                  (this[offset] << 24) |
                  (this[offset + 1] << 16) |
                  (this[offset + 2] << 8) |
                  this[offset + 3]
                );
              };

              Buffer.prototype.readFloatLE = function readFloatLE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);
                return ieee754.read(this, offset, true, 23, 4);
              };

              Buffer.prototype.readFloatBE = function readFloatBE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 4, this.length);
                return ieee754.read(this, offset, false, 23, 4);
              };

              Buffer.prototype.readDoubleLE = function readDoubleLE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 8, this.length);
                return ieee754.read(this, offset, true, 52, 8);
              };

              Buffer.prototype.readDoubleBE = function readDoubleBE(
                offset,
                noAssert
              ) {
                offset = offset >>> 0;
                if (!noAssert) checkOffset(offset, 8, this.length);
                return ieee754.read(this, offset, false, 52, 8);
              };

              function checkInt(buf, value, offset, ext, max, min) {
                if (!Buffer.isBuffer(buf))
                  throw new TypeError(
                    '"buffer" argument must be a Buffer instance'
                  );
                if (value > max || value < min)
                  throw new RangeError('"value" argument is out of bounds');
                if (offset + ext > buf.length)
                  throw new RangeError('Index out of range');
              }

              Buffer.prototype.writeUIntLE = function writeUIntLE(
                value,
                offset,
                byteLength,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) {
                  var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                  checkInt(this, value, offset, byteLength, maxBytes, 0);
                }

                var mul = 1;
                var i = 0;
                this[offset] = value & 0xff;
                while (++i < byteLength && (mul *= 0x100)) {
                  this[offset + i] = (value / mul) & 0xff;
                }

                return offset + byteLength;
              };

              Buffer.prototype.writeUIntBE = function writeUIntBE(
                value,
                offset,
                byteLength,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                byteLength = byteLength >>> 0;
                if (!noAssert) {
                  var maxBytes = Math.pow(2, 8 * byteLength) - 1;
                  checkInt(this, value, offset, byteLength, maxBytes, 0);
                }

                var i = byteLength - 1;
                var mul = 1;
                this[offset + i] = value & 0xff;
                while (--i >= 0 && (mul *= 0x100)) {
                  this[offset + i] = (value / mul) & 0xff;
                }

                return offset + byteLength;
              };

              Buffer.prototype.writeUInt8 = function writeUInt8(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
                this[offset] = value & 0xff;
                return offset + 1;
              };

              Buffer.prototype.writeUInt16LE = function writeUInt16LE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
                this[offset] = value & 0xff;
                this[offset + 1] = value >>> 8;
                return offset + 2;
              };

              Buffer.prototype.writeUInt16BE = function writeUInt16BE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
                this[offset] = value >>> 8;
                this[offset + 1] = value & 0xff;
                return offset + 2;
              };

              Buffer.prototype.writeUInt32LE = function writeUInt32LE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
                this[offset + 3] = value >>> 24;
                this[offset + 2] = value >>> 16;
                this[offset + 1] = value >>> 8;
                this[offset] = value & 0xff;
                return offset + 4;
              };

              Buffer.prototype.writeUInt32BE = function writeUInt32BE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
                this[offset] = value >>> 24;
                this[offset + 1] = value >>> 16;
                this[offset + 2] = value >>> 8;
                this[offset + 3] = value & 0xff;
                return offset + 4;
              };

              Buffer.prototype.writeIntLE = function writeIntLE(
                value,
                offset,
                byteLength,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                  var limit = Math.pow(2, 8 * byteLength - 1);

                  checkInt(this, value, offset, byteLength, limit - 1, -limit);
                }

                var i = 0;
                var mul = 1;
                var sub = 0;
                this[offset] = value & 0xff;
                while (++i < byteLength && (mul *= 0x100)) {
                  if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
                    sub = 1;
                  }
                  this[offset + i] = (((value / mul) >> 0) - sub) & 0xff;
                }

                return offset + byteLength;
              };

              Buffer.prototype.writeIntBE = function writeIntBE(
                value,
                offset,
                byteLength,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                  var limit = Math.pow(2, 8 * byteLength - 1);

                  checkInt(this, value, offset, byteLength, limit - 1, -limit);
                }

                var i = byteLength - 1;
                var mul = 1;
                var sub = 0;
                this[offset + i] = value & 0xff;
                while (--i >= 0 && (mul *= 0x100)) {
                  if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
                    sub = 1;
                  }
                  this[offset + i] = (((value / mul) >> 0) - sub) & 0xff;
                }

                return offset + byteLength;
              };

              Buffer.prototype.writeInt8 = function writeInt8(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
                if (value < 0) value = 0xff + value + 1;
                this[offset] = value & 0xff;
                return offset + 1;
              };

              Buffer.prototype.writeInt16LE = function writeInt16LE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                  checkInt(this, value, offset, 2, 0x7fff, -0x8000);
                this[offset] = value & 0xff;
                this[offset + 1] = value >>> 8;
                return offset + 2;
              };

              Buffer.prototype.writeInt16BE = function writeInt16BE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                  checkInt(this, value, offset, 2, 0x7fff, -0x8000);
                this[offset] = value >>> 8;
                this[offset + 1] = value & 0xff;
                return offset + 2;
              };

              Buffer.prototype.writeInt32LE = function writeInt32LE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                  checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
                this[offset] = value & 0xff;
                this[offset + 1] = value >>> 8;
                this[offset + 2] = value >>> 16;
                this[offset + 3] = value >>> 24;
                return offset + 4;
              };

              Buffer.prototype.writeInt32BE = function writeInt32BE(
                value,
                offset,
                noAssert
              ) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert)
                  checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
                if (value < 0) value = 0xffffffff + value + 1;
                this[offset] = value >>> 24;
                this[offset + 1] = value >>> 16;
                this[offset + 2] = value >>> 8;
                this[offset + 3] = value & 0xff;
                return offset + 4;
              };

              function checkIEEE754(buf, value, offset, ext, max, min) {
                if (offset + ext > buf.length)
                  throw new RangeError('Index out of range');
                if (offset < 0) throw new RangeError('Index out of range');
              }

              function writeFloat(buf, value, offset, littleEndian, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                  checkIEEE754(
                    buf,
                    value,
                    offset,
                    4,
                    3.4028234663852886e38,
                    -3.4028234663852886e38
                  );
                }
                ieee754.write(buf, value, offset, littleEndian, 23, 4);
                return offset + 4;
              }

              Buffer.prototype.writeFloatLE = function writeFloatLE(
                value,
                offset,
                noAssert
              ) {
                return writeFloat(this, value, offset, true, noAssert);
              };

              Buffer.prototype.writeFloatBE = function writeFloatBE(
                value,
                offset,
                noAssert
              ) {
                return writeFloat(this, value, offset, false, noAssert);
              };

              function writeDouble(buf, value, offset, littleEndian, noAssert) {
                value = +value;
                offset = offset >>> 0;
                if (!noAssert) {
                  checkIEEE754(
                    buf,
                    value,
                    offset,
                    8,
                    1.7976931348623157e308,
                    -1.7976931348623157e308
                  );
                }
                ieee754.write(buf, value, offset, littleEndian, 52, 8);
                return offset + 8;
              }

              Buffer.prototype.writeDoubleLE = function writeDoubleLE(
                value,
                offset,
                noAssert
              ) {
                return writeDouble(this, value, offset, true, noAssert);
              };

              Buffer.prototype.writeDoubleBE = function writeDoubleBE(
                value,
                offset,
                noAssert
              ) {
                return writeDouble(this, value, offset, false, noAssert);
              };

              // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
              Buffer.prototype.copy = function copy(
                target,
                targetStart,
                start,
                end
              ) {
                if (!Buffer.isBuffer(target))
                  throw new TypeError('argument should be a Buffer');
                if (!start) start = 0;
                if (!end && end !== 0) end = this.length;
                if (targetStart >= target.length) targetStart = target.length;
                if (!targetStart) targetStart = 0;
                if (end > 0 && end < start) end = start;

                // Copy 0 bytes; we're done
                if (end === start) return 0;
                if (target.length === 0 || this.length === 0) return 0;

                // Fatal error conditions
                if (targetStart < 0) {
                  throw new RangeError('targetStart out of bounds');
                }
                if (start < 0 || start >= this.length)
                  throw new RangeError('Index out of range');
                if (end < 0) throw new RangeError('sourceEnd out of bounds');

                // Are we oob?
                if (end > this.length) end = this.length;
                if (target.length - targetStart < end - start) {
                  end = target.length - targetStart + start;
                }

                var len = end - start;

                if (
                  this === target &&
                  typeof Uint8Array.prototype.copyWithin === 'function'
                ) {
                  // Use built-in when available, missing from IE11
                  this.copyWithin(targetStart, start, end);
                } else if (
                  this === target &&
                  start < targetStart &&
                  targetStart < end
                ) {
                  // descending copy from end
                  for (var i = len - 1; i >= 0; --i) {
                    target[i + targetStart] = this[i + start];
                  }
                } else {
                  Uint8Array.prototype.set.call(
                    target,
                    this.subarray(start, end),
                    targetStart
                  );
                }

                return len;
              };

              // Usage:
              //    buffer.fill(number[, offset[, end]])
              //    buffer.fill(buffer[, offset[, end]])
              //    buffer.fill(string[, offset[, end]][, encoding])
              Buffer.prototype.fill = function fill(val, start, end, encoding) {
                // Handle string cases:
                if (typeof val === 'string') {
                  if (typeof start === 'string') {
                    encoding = start;
                    start = 0;
                    end = this.length;
                  } else if (typeof end === 'string') {
                    encoding = end;
                    end = this.length;
                  }
                  if (encoding !== undefined && typeof encoding !== 'string') {
                    throw new TypeError('encoding must be a string');
                  }
                  if (
                    typeof encoding === 'string' &&
                    !Buffer.isEncoding(encoding)
                  ) {
                    throw new TypeError('Unknown encoding: ' + encoding);
                  }
                  if (val.length === 1) {
                    var code = val.charCodeAt(0);
                    if (
                      (encoding === 'utf8' && code < 128) ||
                      encoding === 'latin1'
                    ) {
                      // Fast path: If `val` fits into a single byte, use that numeric value.
                      val = code;
                    }
                  }
                } else if (typeof val === 'number') {
                  val = val & 255;
                }

                // Invalid ranges are not set to a default, so can range check early.
                if (start < 0 || this.length < start || this.length < end) {
                  throw new RangeError('Out of range index');
                }

                if (end <= start) {
                  return this;
                }

                start = start >>> 0;
                end = end === undefined ? this.length : end >>> 0;

                if (!val) val = 0;

                var i;
                if (typeof val === 'number') {
                  for (i = start; i < end; ++i) {
                    this[i] = val;
                  }
                } else {
                  var bytes = Buffer.isBuffer(val)
                    ? val
                    : Buffer.from(val, encoding);
                  var len = bytes.length;
                  if (len === 0) {
                    throw new TypeError(
                      'The value "' + val + '" is invalid for argument "value"'
                    );
                  }
                  for (i = 0; i < end - start; ++i) {
                    this[i + start] = bytes[i % len];
                  }
                }

                return this;
              };

              // HELPER FUNCTIONS
              // ================

              var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

              function base64clean(str) {
                // Node takes equal signs as end of the Base64 encoding
                str = str.split('=')[0];
                // Node strips out invalid characters like \n and \t from the string, base64-js does not
                str = str.trim().replace(INVALID_BASE64_RE, '');
                // Node converts strings with length < 2 to ''
                if (str.length < 2) return '';
                // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
                while (str.length % 4 !== 0) {
                  str = str + '=';
                }
                return str;
              }

              function toHex(n) {
                if (n < 16) return '0' + n.toString(16);
                return n.toString(16);
              }

              function utf8ToBytes(string, units) {
                units = units || Infinity;
                var codePoint;
                var length = string.length;
                var leadSurrogate = null;
                var bytes = [];

                for (var i = 0; i < length; ++i) {
                  codePoint = string.charCodeAt(i);

                  // is surrogate component
                  if (codePoint > 0xd7ff && codePoint < 0xe000) {
                    // last char was a lead
                    if (!leadSurrogate) {
                      // no lead yet
                      if (codePoint > 0xdbff) {
                        // unexpected trail
                        if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
                        continue;
                      } else if (i + 1 === length) {
                        // unpaired lead
                        if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
                        continue;
                      }

                      // valid lead
                      leadSurrogate = codePoint;

                      continue;
                    }

                    // 2 leads in a row
                    if (codePoint < 0xdc00) {
                      if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
                      leadSurrogate = codePoint;
                      continue;
                    }

                    // valid surrogate pair
                    codePoint =
                      (((leadSurrogate - 0xd800) << 10) |
                        (codePoint - 0xdc00)) +
                      0x10000;
                  } else if (leadSurrogate) {
                    // valid bmp char, but last char was a lead
                    if ((units -= 3) > -1) bytes.push(0xef, 0xbf, 0xbd);
                  }

                  leadSurrogate = null;

                  // encode utf8
                  if (codePoint < 0x80) {
                    if ((units -= 1) < 0) break;
                    bytes.push(codePoint);
                  } else if (codePoint < 0x800) {
                    if ((units -= 2) < 0) break;
                    bytes.push(
                      (codePoint >> 0x6) | 0xc0,
                      (codePoint & 0x3f) | 0x80
                    );
                  } else if (codePoint < 0x10000) {
                    if ((units -= 3) < 0) break;
                    bytes.push(
                      (codePoint >> 0xc) | 0xe0,
                      ((codePoint >> 0x6) & 0x3f) | 0x80,
                      (codePoint & 0x3f) | 0x80
                    );
                  } else if (codePoint < 0x110000) {
                    if ((units -= 4) < 0) break;
                    bytes.push(
                      (codePoint >> 0x12) | 0xf0,
                      ((codePoint >> 0xc) & 0x3f) | 0x80,
                      ((codePoint >> 0x6) & 0x3f) | 0x80,
                      (codePoint & 0x3f) | 0x80
                    );
                  } else {
                    throw new Error('Invalid code point');
                  }
                }

                return bytes;
              }

              function asciiToBytes(str) {
                var byteArray = [];
                for (var i = 0; i < str.length; ++i) {
                  // Node's code seems to be doing this and not & 0x7F..
                  byteArray.push(str.charCodeAt(i) & 0xff);
                }
                return byteArray;
              }

              function utf16leToBytes(str, units) {
                var c, hi, lo;
                var byteArray = [];
                for (var i = 0; i < str.length; ++i) {
                  if ((units -= 2) < 0) break;

                  c = str.charCodeAt(i);
                  hi = c >> 8;
                  lo = c % 256;
                  byteArray.push(lo);
                  byteArray.push(hi);
                }

                return byteArray;
              }

              function base64ToBytes(str) {
                return base64.toByteArray(base64clean(str));
              }

              function blitBuffer(src, dst, offset, length) {
                for (var i = 0; i < length; ++i) {
                  if (i + offset >= dst.length || i >= src.length) break;
                  dst[i + offset] = src[i];
                }
                return i;
              }

              // ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
              // the `instanceof` check but they should be treated as of that type.
              // See: https://github.com/feross/buffer/issues/166
              function isInstance(obj, type) {
                return (
                  obj instanceof type ||
                  (obj != null &&
                    obj.constructor != null &&
                    obj.constructor.name != null &&
                    obj.constructor.name === type.name)
                );
              }
              function numberIsNaN(obj) {
                // For IE11 support
                return obj !== obj; // eslint-disable-line no-self-compare
              }
            }.call(this));
          }.call(this, require('buffer').Buffer));
        },
        { 'base64-js': 5, buffer: 7, ieee754: 9 },
      ],
      8: [
        function (require, module, exports) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          'use strict';

          var R = typeof Reflect === 'object' ? Reflect : null;
          var ReflectApply =
            R && typeof R.apply === 'function'
              ? R.apply
              : function ReflectApply(target, receiver, args) {
                  return Function.prototype.apply.call(target, receiver, args);
                };

          var ReflectOwnKeys;
          if (R && typeof R.ownKeys === 'function') {
            ReflectOwnKeys = R.ownKeys;
          } else if (Object.getOwnPropertySymbols) {
            ReflectOwnKeys = function ReflectOwnKeys(target) {
              return Object.getOwnPropertyNames(target).concat(
                Object.getOwnPropertySymbols(target)
              );
            };
          } else {
            ReflectOwnKeys = function ReflectOwnKeys(target) {
              return Object.getOwnPropertyNames(target);
            };
          }

          function ProcessEmitWarning(warning) {
            if (console && console.warn) console.warn(warning);
          }

          var NumberIsNaN =
            Number.isNaN ||
            function NumberIsNaN(value) {
              return value !== value;
            };

          function EventEmitter() {
            EventEmitter.init.call(this);
          }
          module.exports = EventEmitter;
          module.exports.once = once;

          // Backwards-compat with node 0.10.x
          EventEmitter.EventEmitter = EventEmitter;

          EventEmitter.prototype._events = undefined;
          EventEmitter.prototype._eventsCount = 0;
          EventEmitter.prototype._maxListeners = undefined;

          // By default EventEmitters will print a warning if more than 10 listeners are
          // added to it. This is a useful default which helps finding memory leaks.
          var defaultMaxListeners = 10;

          function checkListener(listener) {
            if (typeof listener !== 'function') {
              throw new TypeError(
                'The "listener" argument must be of type Function. Received type ' +
                  typeof listener
              );
            }
          }

          Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
            enumerable: true,
            get: function () {
              return defaultMaxListeners;
            },
            set: function (arg) {
              if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
                throw new RangeError(
                  'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                    arg +
                    '.'
                );
              }
              defaultMaxListeners = arg;
            },
          });

          EventEmitter.init = function () {
            if (
              this._events === undefined ||
              this._events === Object.getPrototypeOf(this)._events
            ) {
              this._events = Object.create(null);
              this._eventsCount = 0;
            }

            this._maxListeners = this._maxListeners || undefined;
          };

          // Obviously not all Emitters should be limited to 10. This function allows
          // that to be increased. Set to zero for unlimited.
          EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
            if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
              throw new RangeError(
                'The value of "n" is out of range. It must be a non-negative number. Received ' +
                  n +
                  '.'
              );
            }
            this._maxListeners = n;
            return this;
          };

          function _getMaxListeners(that) {
            if (that._maxListeners === undefined)
              return EventEmitter.defaultMaxListeners;
            return that._maxListeners;
          }

          EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
            return _getMaxListeners(this);
          };

          EventEmitter.prototype.emit = function emit(type) {
            var args = [];
            for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
            var doError = type === 'error';

            var events = this._events;
            if (events !== undefined)
              doError = doError && events.error === undefined;
            else if (!doError) return false;

            // If there is no 'error' event listener then throw.
            if (doError) {
              var er;
              if (args.length > 0) er = args[0];
              if (er instanceof Error) {
                // Note: The comments on the `throw` lines are intentional, they show
                // up in Node's output if this results in an unhandled exception.
                throw er; // Unhandled 'error' event
              }
              // At least give some kind of context to the user
              var err = new Error(
                'Unhandled error.' + (er ? ' (' + er.message + ')' : '')
              );
              err.context = er;
              throw err; // Unhandled 'error' event
            }

            var handler = events[type];

            if (handler === undefined) return false;

            if (typeof handler === 'function') {
              ReflectApply(handler, this, args);
            } else {
              var len = handler.length;
              var listeners = arrayClone(handler, len);
              for (var i = 0; i < len; ++i)
                ReflectApply(listeners[i], this, args);
            }

            return true;
          };

          function _addListener(target, type, listener, prepend) {
            var m;
            var events;
            var existing;

            checkListener(listener);

            events = target._events;
            if (events === undefined) {
              events = target._events = Object.create(null);
              target._eventsCount = 0;
            } else {
              // To avoid recursion in the case that type === "newListener"! Before
              // adding it to the listeners, first emit "newListener".
              if (events.newListener !== undefined) {
                target.emit(
                  'newListener',
                  type,
                  listener.listener ? listener.listener : listener
                );

                // Re-assign `events` because a newListener handler could have caused the
                // this._events to be assigned to a new object
                events = target._events;
              }
              existing = events[type];
            }

            if (existing === undefined) {
              // Optimize the case of one listener. Don't need the extra array object.
              existing = events[type] = listener;
              ++target._eventsCount;
            } else {
              if (typeof existing === 'function') {
                // Adding the second element, need to change to array.
                existing = events[type] = prepend
                  ? [listener, existing]
                  : [existing, listener];
                // If we've already got an array, just append.
              } else if (prepend) {
                existing.unshift(listener);
              } else {
                existing.push(listener);
              }

              // Check for listener leak
              m = _getMaxListeners(target);
              if (m > 0 && existing.length > m && !existing.warned) {
                existing.warned = true;
                // No error code for this since it is a Warning
                // eslint-disable-next-line no-restricted-syntax
                var w = new Error(
                  'Possible EventEmitter memory leak detected. ' +
                    existing.length +
                    ' ' +
                    String(type) +
                    ' listeners ' +
                    'added. Use emitter.setMaxListeners() to ' +
                    'increase limit'
                );
                w.name = 'MaxListenersExceededWarning';
                w.emitter = target;
                w.type = type;
                w.count = existing.length;
                ProcessEmitWarning(w);
              }
            }

            return target;
          }

          EventEmitter.prototype.addListener = function addListener(
            type,
            listener
          ) {
            return _addListener(this, type, listener, false);
          };

          EventEmitter.prototype.on = EventEmitter.prototype.addListener;

          EventEmitter.prototype.prependListener = function prependListener(
            type,
            listener
          ) {
            return _addListener(this, type, listener, true);
          };

          function onceWrapper() {
            if (!this.fired) {
              this.target.removeListener(this.type, this.wrapFn);
              this.fired = true;
              if (arguments.length === 0)
                return this.listener.call(this.target);
              return this.listener.apply(this.target, arguments);
            }
          }

          function _onceWrap(target, type, listener) {
            var state = {
              fired: false,
              wrapFn: undefined,
              target: target,
              type: type,
              listener: listener,
            };
            var wrapped = onceWrapper.bind(state);
            wrapped.listener = listener;
            state.wrapFn = wrapped;
            return wrapped;
          }

          EventEmitter.prototype.once = function once(type, listener) {
            checkListener(listener);
            this.on(type, _onceWrap(this, type, listener));
            return this;
          };

          EventEmitter.prototype.prependOnceListener =
            function prependOnceListener(type, listener) {
              checkListener(listener);
              this.prependListener(type, _onceWrap(this, type, listener));
              return this;
            };

          // Emits a 'removeListener' event if and only if the listener was removed.
          EventEmitter.prototype.removeListener = function removeListener(
            type,
            listener
          ) {
            var list, events, position, i, originalListener;

            checkListener(listener);

            events = this._events;
            if (events === undefined) return this;

            list = events[type];
            if (list === undefined) return this;

            if (list === listener || list.listener === listener) {
              if (--this._eventsCount === 0) this._events = Object.create(null);
              else {
                delete events[type];
                if (events.removeListener)
                  this.emit('removeListener', type, list.listener || listener);
              }
            } else if (typeof list !== 'function') {
              position = -1;

              for (i = list.length - 1; i >= 0; i--) {
                if (list[i] === listener || list[i].listener === listener) {
                  originalListener = list[i].listener;
                  position = i;
                  break;
                }
              }

              if (position < 0) return this;

              if (position === 0) list.shift();
              else {
                spliceOne(list, position);
              }

              if (list.length === 1) events[type] = list[0];

              if (events.removeListener !== undefined)
                this.emit('removeListener', type, originalListener || listener);
            }

            return this;
          };

          EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

          EventEmitter.prototype.removeAllListeners =
            function removeAllListeners(type) {
              var listeners, events, i;

              events = this._events;
              if (events === undefined) return this;

              // not listening for removeListener, no need to emit
              if (events.removeListener === undefined) {
                if (arguments.length === 0) {
                  this._events = Object.create(null);
                  this._eventsCount = 0;
                } else if (events[type] !== undefined) {
                  if (--this._eventsCount === 0)
                    this._events = Object.create(null);
                  else delete events[type];
                }
                return this;
              }

              // emit removeListener for all listeners on all events
              if (arguments.length === 0) {
                var keys = Object.keys(events);
                var key;
                for (i = 0; i < keys.length; ++i) {
                  key = keys[i];
                  if (key === 'removeListener') continue;
                  this.removeAllListeners(key);
                }
                this.removeAllListeners('removeListener');
                this._events = Object.create(null);
                this._eventsCount = 0;
                return this;
              }

              listeners = events[type];

              if (typeof listeners === 'function') {
                this.removeListener(type, listeners);
              } else if (listeners !== undefined) {
                // LIFO order
                for (i = listeners.length - 1; i >= 0; i--) {
                  this.removeListener(type, listeners[i]);
                }
              }

              return this;
            };

          function _listeners(target, type, unwrap) {
            var events = target._events;

            if (events === undefined) return [];

            var evlistener = events[type];
            if (evlistener === undefined) return [];

            if (typeof evlistener === 'function')
              return unwrap
                ? [evlistener.listener || evlistener]
                : [evlistener];

            return unwrap
              ? unwrapListeners(evlistener)
              : arrayClone(evlistener, evlistener.length);
          }

          EventEmitter.prototype.listeners = function listeners(type) {
            return _listeners(this, type, true);
          };

          EventEmitter.prototype.rawListeners = function rawListeners(type) {
            return _listeners(this, type, false);
          };

          EventEmitter.listenerCount = function (emitter, type) {
            if (typeof emitter.listenerCount === 'function') {
              return emitter.listenerCount(type);
            } else {
              return listenerCount.call(emitter, type);
            }
          };

          EventEmitter.prototype.listenerCount = listenerCount;
          function listenerCount(type) {
            var events = this._events;

            if (events !== undefined) {
              var evlistener = events[type];

              if (typeof evlistener === 'function') {
                return 1;
              } else if (evlistener !== undefined) {
                return evlistener.length;
              }
            }

            return 0;
          }

          EventEmitter.prototype.eventNames = function eventNames() {
            return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
          };

          function arrayClone(arr, n) {
            var copy = new Array(n);
            for (var i = 0; i < n; ++i) copy[i] = arr[i];
            return copy;
          }

          function spliceOne(list, index) {
            for (; index + 1 < list.length; index++)
              list[index] = list[index + 1];
            list.pop();
          }

          function unwrapListeners(arr) {
            var ret = new Array(arr.length);
            for (var i = 0; i < ret.length; ++i) {
              ret[i] = arr[i].listener || arr[i];
            }
            return ret;
          }

          function once(emitter, name) {
            return new Promise(function (resolve, reject) {
              function eventListener() {
                if (errorListener !== undefined) {
                  emitter.removeListener('error', errorListener);
                }
                resolve([].slice.call(arguments));
              }
              var errorListener;

              // Adding an error listener is not optional because
              // if an error is thrown on an event emitter we cannot
              // guarantee that the actual event we are waiting will
              // be fired. The result could be a silent way to create
              // memory or file descriptor leaks, which is something
              // we should avoid.
              if (name !== 'error') {
                errorListener = function errorListener(err) {
                  emitter.removeListener(name, eventListener);
                  reject(err);
                };

                emitter.once('error', errorListener);
              }

              emitter.once(name, eventListener);
            });
          }
        },
        {},
      ],
      9: [
        function (require, module, exports) {
          /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
          exports.read = function (buffer, offset, isLE, mLen, nBytes) {
            var e, m;
            var eLen = nBytes * 8 - mLen - 1;
            var eMax = (1 << eLen) - 1;
            var eBias = eMax >> 1;
            var nBits = -7;
            var i = isLE ? nBytes - 1 : 0;
            var d = isLE ? -1 : 1;
            var s = buffer[offset + i];

            i += d;

            e = s & ((1 << -nBits) - 1);
            s >>= -nBits;
            nBits += eLen;
            for (
              ;
              nBits > 0;
              e = e * 256 + buffer[offset + i], i += d, nBits -= 8
            ) {}

            m = e & ((1 << -nBits) - 1);
            e >>= -nBits;
            nBits += mLen;
            for (
              ;
              nBits > 0;
              m = m * 256 + buffer[offset + i], i += d, nBits -= 8
            ) {}

            if (e === 0) {
              e = 1 - eBias;
            } else if (e === eMax) {
              return m ? NaN : (s ? -1 : 1) * Infinity;
            } else {
              m = m + Math.pow(2, mLen);
              e = e - eBias;
            }
            return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
          };

          exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
            var e, m, c;
            var eLen = nBytes * 8 - mLen - 1;
            var eMax = (1 << eLen) - 1;
            var eBias = eMax >> 1;
            var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
            var i = isLE ? 0 : nBytes - 1;
            var d = isLE ? 1 : -1;
            var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

            value = Math.abs(value);

            if (isNaN(value) || value === Infinity) {
              m = isNaN(value) ? 1 : 0;
              e = eMax;
            } else {
              e = Math.floor(Math.log(value) / Math.LN2);
              if (value * (c = Math.pow(2, -e)) < 1) {
                e--;
                c *= 2;
              }
              if (e + eBias >= 1) {
                value += rt / c;
              } else {
                value += rt * Math.pow(2, 1 - eBias);
              }
              if (value * c >= 2) {
                e++;
                c /= 2;
              }

              if (e + eBias >= eMax) {
                m = 0;
                e = eMax;
              } else if (e + eBias >= 1) {
                m = (value * c - 1) * Math.pow(2, mLen);
                e = e + eBias;
              } else {
                m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                e = 0;
              }
            }

            for (
              ;
              mLen >= 8;
              buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8
            ) {}

            e = (e << mLen) | m;
            eLen += mLen;
            for (
              ;
              eLen > 0;
              buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8
            ) {}

            buffer[offset + i - d] |= s * 128;
          };
        },
        {},
      ],
      10: [
        function (require, module, exports) {
          if (typeof Object.create === 'function') {
            // implementation from standard node.js 'util' module
            module.exports = function inherits(ctor, superCtor) {
              if (superCtor) {
                ctor.super_ = superCtor;
                ctor.prototype = Object.create(superCtor.prototype, {
                  constructor: {
                    value: ctor,
                    enumerable: false,
                    writable: true,
                    configurable: true,
                  },
                });
              }
            };
          } else {
            // old school shim for old browsers
            module.exports = function inherits(ctor, superCtor) {
              if (superCtor) {
                ctor.super_ = superCtor;
                var TempCtor = function () {};
                TempCtor.prototype = superCtor.prototype;
                ctor.prototype = new TempCtor();
                ctor.prototype.constructor = ctor;
              }
            };
          }
        },
        {},
      ],
      11: [
        function (require, module, exports) {
          /*!
           * Determine if an object is a Buffer
           *
           * @author   Feross Aboukhadijeh <https://feross.org>
           * @license  MIT
           */

          // The _isBuffer check is for Safari 5-7 support, because it's missing
          // Object.prototype.constructor. Remove this eventually
          module.exports = function (obj) {
            return (
              obj != null &&
              (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
            );
          };

          function isBuffer(obj) {
            return (
              !!obj.constructor &&
              typeof obj.constructor.isBuffer === 'function' &&
              obj.constructor.isBuffer(obj)
            );
          }

          // For Node v0.10 support. Remove this eventually.
          function isSlowBuffer(obj) {
            return (
              typeof obj.readFloatLE === 'function' &&
              typeof obj.slice === 'function' &&
              isBuffer(obj.slice(0, 0))
            );
          }
        },
        {},
      ],
      12: [
        function (require, module, exports) {
          /*
object-assign
(c) Sindre Sorhus
@license MIT
*/

          'use strict';
          /* eslint-disable no-unused-vars */
          var getOwnPropertySymbols = Object.getOwnPropertySymbols;
          var hasOwnProperty = Object.prototype.hasOwnProperty;
          var propIsEnumerable = Object.prototype.propertyIsEnumerable;

          function toObject(val) {
            if (val === null || val === undefined) {
              throw new TypeError(
                'Object.assign cannot be called with null or undefined'
              );
            }

            return Object(val);
          }

          function shouldUseNative() {
            try {
              if (!Object.assign) {
                return false;
              }

              // Detect buggy property enumeration order in older V8 versions.

              // https://bugs.chromium.org/p/v8/issues/detail?id=4118
              var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
              test1[5] = 'de';
              if (Object.getOwnPropertyNames(test1)[0] === '5') {
                return false;
              }

              // https://bugs.chromium.org/p/v8/issues/detail?id=3056
              var test2 = {};
              for (var i = 0; i < 10; i++) {
                test2['_' + String.fromCharCode(i)] = i;
              }
              var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
                return test2[n];
              });
              if (order2.join('') !== '0123456789') {
                return false;
              }

              // https://bugs.chromium.org/p/v8/issues/detail?id=3056
              var test3 = {};
              'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
                test3[letter] = letter;
              });
              if (
                Object.keys(Object.assign({}, test3)).join('') !==
                'abcdefghijklmnopqrst'
              ) {
                return false;
              }

              return true;
            } catch (err) {
              // We don't expect any of the above to throw, but better to be safe.
              return false;
            }
          }

          module.exports = shouldUseNative()
            ? Object.assign
            : function (target, source) {
                var from;
                var to = toObject(target);
                var symbols;

                for (var s = 1; s < arguments.length; s++) {
                  from = Object(arguments[s]);

                  for (var key in from) {
                    if (hasOwnProperty.call(from, key)) {
                      to[key] = from[key];
                    }
                  }

                  if (getOwnPropertySymbols) {
                    symbols = getOwnPropertySymbols(from);
                    for (var i = 0; i < symbols.length; i++) {
                      if (propIsEnumerable.call(from, symbols[i])) {
                        to[symbols[i]] = from[symbols[i]];
                      }
                    }
                  }
                }

                return to;
              };
        },
        {},
      ],
      13: [
        function (require, module, exports) {
          // shim for using process in browser
          var process = (module.exports = {});

          // cached from whatever global is present so that test runners that stub it
          // don't break things.  But we need to wrap it in a try catch in case it is
          // wrapped in strict mode code which doesn't define any globals.  It's inside a
          // function because try/catches deoptimize in certain engines.

          var cachedSetTimeout;
          var cachedClearTimeout;

          function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
          }
          function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
          }
          (function () {
            try {
              if (typeof setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
              } else {
                cachedSetTimeout = defaultSetTimout;
              }
            } catch (e) {
              cachedSetTimeout = defaultSetTimout;
            }
            try {
              if (typeof clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
              } else {
                cachedClearTimeout = defaultClearTimeout;
              }
            } catch (e) {
              cachedClearTimeout = defaultClearTimeout;
            }
          })();
          function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
              //normal enviroments in sane situations
              return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if (
              (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
              setTimeout
            ) {
              cachedSetTimeout = setTimeout;
              return setTimeout(fun, 0);
            }
            try {
              // when when somebody has screwed with setTimeout but no I.E. maddness
              return cachedSetTimeout(fun, 0);
            } catch (e) {
              try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
              } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
              }
            }
          }
          function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
              //normal enviroments in sane situations
              return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if (
              (cachedClearTimeout === defaultClearTimeout ||
                !cachedClearTimeout) &&
              clearTimeout
            ) {
              cachedClearTimeout = clearTimeout;
              return clearTimeout(marker);
            }
            try {
              // when when somebody has screwed with setTimeout but no I.E. maddness
              return cachedClearTimeout(marker);
            } catch (e) {
              try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
              } catch (e) {
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
              }
            }
          }
          var queue = [];
          var draining = false;
          var currentQueue;
          var queueIndex = -1;

          function cleanUpNextTick() {
            if (!draining || !currentQueue) {
              return;
            }
            draining = false;
            if (currentQueue.length) {
              queue = currentQueue.concat(queue);
            } else {
              queueIndex = -1;
            }
            if (queue.length) {
              drainQueue();
            }
          }

          function drainQueue() {
            if (draining) {
              return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
              currentQueue = queue;
              queue = [];
              while (++queueIndex < len) {
                if (currentQueue) {
                  currentQueue[queueIndex].run();
                }
              }
              queueIndex = -1;
              len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
          }

          process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
              for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
              }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
              runTimeout(drainQueue);
            }
          };

          // v8 likes predictible objects
          function Item(fun, array) {
            this.fun = fun;
            this.array = array;
          }
          Item.prototype.run = function () {
            this.fun.apply(null, this.array);
          };
          process.title = 'browser';
          process.browser = true;
          process.env = {};
          process.argv = [];
          process.version = ''; // empty string to avoid regexp issues
          process.versions = {};

          function noop() {}

          process.on = noop;
          process.addListener = noop;
          process.once = noop;
          process.off = noop;
          process.removeListener = noop;
          process.removeAllListeners = noop;
          process.emit = noop;
          process.prependListener = noop;
          process.prependOnceListener = noop;

          process.listeners = function (name) {
            return [];
          };

          process.binding = function (name) {
            throw new Error('process.binding is not supported');
          };

          process.cwd = function () {
            return '/';
          };
          process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
          };
          process.umask = function () {
            return 0;
          };
        },
        {},
      ],
      14: [
        function (require, module, exports) {
          /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
          /* eslint-disable node/no-deprecated-api */
          var buffer = require('buffer');
          var Buffer = buffer.Buffer;

          // alternative to using Object.keys for old browsers
          function copyProps(src, dst) {
            for (var key in src) {
              dst[key] = src[key];
            }
          }
          if (
            Buffer.from &&
            Buffer.alloc &&
            Buffer.allocUnsafe &&
            Buffer.allocUnsafeSlow
          ) {
            module.exports = buffer;
          } else {
            // Copy properties from require('buffer')
            copyProps(buffer, exports);
            exports.Buffer = SafeBuffer;
          }

          function SafeBuffer(arg, encodingOrOffset, length) {
            return Buffer(arg, encodingOrOffset, length);
          }

          SafeBuffer.prototype = Object.create(Buffer.prototype);

          // Copy static methods from Buffer
          copyProps(Buffer, SafeBuffer);

          SafeBuffer.from = function (arg, encodingOrOffset, length) {
            if (typeof arg === 'number') {
              throw new TypeError('Argument must not be a number');
            }
            return Buffer(arg, encodingOrOffset, length);
          };

          SafeBuffer.alloc = function (size, fill, encoding) {
            if (typeof size !== 'number') {
              throw new TypeError('Argument must be a number');
            }
            var buf = Buffer(size);
            if (fill !== undefined) {
              if (typeof encoding === 'string') {
                buf.fill(fill, encoding);
              } else {
                buf.fill(fill);
              }
            } else {
              buf.fill(0);
            }
            return buf;
          };

          SafeBuffer.allocUnsafe = function (size) {
            if (typeof size !== 'number') {
              throw new TypeError('Argument must be a number');
            }
            return Buffer(size);
          };

          SafeBuffer.allocUnsafeSlow = function (size) {
            if (typeof size !== 'number') {
              throw new TypeError('Argument must be a number');
            }
            return buffer.SlowBuffer(size);
          };
        },
        { buffer: 7 },
      ],
      15: [
        function (require, module, exports) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          module.exports = Stream;

          var EE = require('events').EventEmitter;
          var inherits = require('inherits');

          inherits(Stream, EE);
          Stream.Readable = require('readable-stream/lib/_stream_readable.js');
          Stream.Writable = require('readable-stream/lib/_stream_writable.js');
          Stream.Duplex = require('readable-stream/lib/_stream_duplex.js');
          Stream.Transform = require('readable-stream/lib/_stream_transform.js');
          Stream.PassThrough = require('readable-stream/lib/_stream_passthrough.js');
          Stream.finished = require('readable-stream/lib/internal/streams/end-of-stream.js');
          Stream.pipeline = require('readable-stream/lib/internal/streams/pipeline.js');

          // Backwards-compat with node 0.4.x
          Stream.Stream = Stream;

          // old-style streams.  Note that the pipe method (the only relevant
          // part of this class) is overridden in the Readable class.

          function Stream() {
            EE.call(this);
          }

          Stream.prototype.pipe = function (dest, options) {
            var source = this;

            function ondata(chunk) {
              if (dest.writable) {
                if (false === dest.write(chunk) && source.pause) {
                  source.pause();
                }
              }
            }

            source.on('data', ondata);

            function ondrain() {
              if (source.readable && source.resume) {
                source.resume();
              }
            }

            dest.on('drain', ondrain);

            // If the 'end' option is not supplied, dest.end() will be called when
            // source gets the 'end' or 'close' events.  Only dest.end() once.
            if (!dest._isStdio && (!options || options.end !== false)) {
              source.on('end', onend);
              source.on('close', onclose);
            }

            var didOnEnd = false;
            function onend() {
              if (didOnEnd) return;
              didOnEnd = true;

              dest.end();
            }

            function onclose() {
              if (didOnEnd) return;
              didOnEnd = true;

              if (typeof dest.destroy === 'function') dest.destroy();
            }

            // don't leave dangling pipes when there are errors.
            function onerror(er) {
              cleanup();
              if (EE.listenerCount(this, 'error') === 0) {
                throw er; // Unhandled stream error in pipe.
              }
            }

            source.on('error', onerror);
            dest.on('error', onerror);

            // remove all the event listeners that were added.
            function cleanup() {
              source.removeListener('data', ondata);
              dest.removeListener('drain', ondrain);

              source.removeListener('end', onend);
              source.removeListener('close', onclose);

              source.removeListener('error', onerror);
              dest.removeListener('error', onerror);

              source.removeListener('end', cleanup);
              source.removeListener('close', cleanup);

              dest.removeListener('close', cleanup);
            }

            source.on('end', cleanup);
            source.on('close', cleanup);

            dest.on('close', cleanup);

            dest.emit('pipe', source);

            // Allow for unix-like usage: A.pipe(B).pipe(C)
            return dest;
          };
        },
        {
          events: 8,
          inherits: 10,
          'readable-stream/lib/_stream_duplex.js': 17,
          'readable-stream/lib/_stream_passthrough.js': 18,
          'readable-stream/lib/_stream_readable.js': 19,
          'readable-stream/lib/_stream_transform.js': 20,
          'readable-stream/lib/_stream_writable.js': 21,
          'readable-stream/lib/internal/streams/end-of-stream.js': 25,
          'readable-stream/lib/internal/streams/pipeline.js': 27,
        },
      ],
      16: [
        function (require, module, exports) {
          'use strict';

          function _inheritsLoose(subClass, superClass) {
            subClass.prototype = Object.create(superClass.prototype);
            subClass.prototype.constructor = subClass;
            subClass.__proto__ = superClass;
          }

          var codes = {};

          function createErrorType(code, message, Base) {
            if (!Base) {
              Base = Error;
            }

            function getMessage(arg1, arg2, arg3) {
              if (typeof message === 'string') {
                return message;
              } else {
                return message(arg1, arg2, arg3);
              }
            }

            var NodeError =
              /*#__PURE__*/
              (function (_Base) {
                _inheritsLoose(NodeError, _Base);

                function NodeError(arg1, arg2, arg3) {
                  return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
                }

                return NodeError;
              })(Base);

            NodeError.prototype.name = Base.name;
            NodeError.prototype.code = code;
            codes[code] = NodeError;
          } // https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js

          function oneOf(expected, thing) {
            if (Array.isArray(expected)) {
              var len = expected.length;
              expected = expected.map(function (i) {
                return String(i);
              });

              if (len > 2) {
                return (
                  'one of '
                    .concat(thing, ' ')
                    .concat(expected.slice(0, len - 1).join(', '), ', or ') +
                  expected[len - 1]
                );
              } else if (len === 2) {
                return 'one of '
                  .concat(thing, ' ')
                  .concat(expected[0], ' or ')
                  .concat(expected[1]);
              } else {
                return 'of '.concat(thing, ' ').concat(expected[0]);
              }
            } else {
              return 'of '.concat(thing, ' ').concat(String(expected));
            }
          } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith

          function startsWith(str, search, pos) {
            return (
              str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search
            );
          } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith

          function endsWith(str, search, this_len) {
            if (this_len === undefined || this_len > str.length) {
              this_len = str.length;
            }

            return str.substring(this_len - search.length, this_len) === search;
          } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes

          function includes(str, search, start) {
            if (typeof start !== 'number') {
              start = 0;
            }

            if (start + search.length > str.length) {
              return false;
            } else {
              return str.indexOf(search, start) !== -1;
            }
          }

          createErrorType(
            'ERR_INVALID_OPT_VALUE',
            function (name, value) {
              return (
                'The value "' + value + '" is invalid for option "' + name + '"'
              );
            },
            TypeError
          );
          createErrorType(
            'ERR_INVALID_ARG_TYPE',
            function (name, expected, actual) {
              // determiner: 'must be' or 'must not be'
              var determiner;

              if (
                typeof expected === 'string' &&
                startsWith(expected, 'not ')
              ) {
                determiner = 'must not be';
                expected = expected.replace(/^not /, '');
              } else {
                determiner = 'must be';
              }

              var msg;

              if (endsWith(name, ' argument')) {
                // For cases like 'first argument'
                msg = 'The '
                  .concat(name, ' ')
                  .concat(determiner, ' ')
                  .concat(oneOf(expected, 'type'));
              } else {
                var type = includes(name, '.') ? 'property' : 'argument';
                msg = 'The "'
                  .concat(name, '" ')
                  .concat(type, ' ')
                  .concat(determiner, ' ')
                  .concat(oneOf(expected, 'type'));
              }

              msg += '. Received type '.concat(typeof actual);
              return msg;
            },
            TypeError
          );
          createErrorType(
            'ERR_STREAM_PUSH_AFTER_EOF',
            'stream.push() after EOF'
          );
          createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
            return 'The ' + name + ' method is not implemented';
          });
          createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
          createErrorType('ERR_STREAM_DESTROYED', function (name) {
            return 'Cannot call ' + name + ' after a stream was destroyed';
          });
          createErrorType(
            'ERR_MULTIPLE_CALLBACK',
            'Callback called multiple times'
          );
          createErrorType(
            'ERR_STREAM_CANNOT_PIPE',
            'Cannot pipe, not readable'
          );
          createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
          createErrorType(
            'ERR_STREAM_NULL_VALUES',
            'May not write null values to stream',
            TypeError
          );
          createErrorType(
            'ERR_UNKNOWN_ENCODING',
            function (arg) {
              return 'Unknown encoding: ' + arg;
            },
            TypeError
          );
          createErrorType(
            'ERR_STREAM_UNSHIFT_AFTER_END_EVENT',
            'stream.unshift() after end event'
          );
          module.exports.codes = codes;
        },
        {},
      ],
      17: [
        function (require, module, exports) {
          (function (process) {
            (function () {
              // Copyright Joyent, Inc. and other Node contributors.
              //
              // Permission is hereby granted, free of charge, to any person obtaining a
              // copy of this software and associated documentation files (the
              // "Software"), to deal in the Software without restriction, including
              // without limitation the rights to use, copy, modify, merge, publish,
              // distribute, sublicense, and/or sell copies of the Software, and to permit
              // persons to whom the Software is furnished to do so, subject to the
              // following conditions:
              //
              // The above copyright notice and this permission notice shall be included
              // in all copies or substantial portions of the Software.
              //
              // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
              // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
              // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
              // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
              // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
              // USE OR OTHER DEALINGS IN THE SOFTWARE.
              // a duplex stream is just a stream that is both readable and writable.
              // Since JS doesn't have multiple prototypal inheritance, this class
              // prototypally inherits from Readable, and then parasitically from
              // Writable.
              'use strict';
              /*<replacement>*/

              var objectKeys =
                Object.keys ||
                function (obj) {
                  var keys = [];

                  for (var key in obj) {
                    keys.push(key);
                  }

                  return keys;
                };
              /*</replacement>*/

              module.exports = Duplex;

              var Readable = require('./_stream_readable');

              var Writable = require('./_stream_writable');

              require('inherits')(Duplex, Readable);

              {
                // Allow the keys array to be GC'ed.
                var keys = objectKeys(Writable.prototype);

                for (var v = 0; v < keys.length; v++) {
                  var method = keys[v];
                  if (!Duplex.prototype[method])
                    Duplex.prototype[method] = Writable.prototype[method];
                }
              }

              function Duplex(options) {
                if (!(this instanceof Duplex)) return new Duplex(options);
                Readable.call(this, options);
                Writable.call(this, options);
                this.allowHalfOpen = true;

                if (options) {
                  if (options.readable === false) this.readable = false;
                  if (options.writable === false) this.writable = false;

                  if (options.allowHalfOpen === false) {
                    this.allowHalfOpen = false;
                    this.once('end', onend);
                  }
                }
              }

              Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  return this._writableState.highWaterMark;
                },
              });
              Object.defineProperty(Duplex.prototype, 'writableBuffer', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  return this._writableState && this._writableState.getBuffer();
                },
              });
              Object.defineProperty(Duplex.prototype, 'writableLength', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  return this._writableState.length;
                },
              }); // the no-half-open enforcer

              function onend() {
                // If the writable side ended, then we're ok.
                if (this._writableState.ended) return; // no more data can be written.
                // But allow more writes to happen in this tick.

                process.nextTick(onEndNT, this);
              }

              function onEndNT(self) {
                self.end();
              }

              Object.defineProperty(Duplex.prototype, 'destroyed', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  if (
                    this._readableState === undefined ||
                    this._writableState === undefined
                  ) {
                    return false;
                  }

                  return (
                    this._readableState.destroyed &&
                    this._writableState.destroyed
                  );
                },
                set: function set(value) {
                  // we ignore the value if the stream
                  // has not been initialized yet
                  if (
                    this._readableState === undefined ||
                    this._writableState === undefined
                  ) {
                    return;
                  } // backward compatibility, the user is explicitly
                  // managing destroyed

                  this._readableState.destroyed = value;
                  this._writableState.destroyed = value;
                },
              });
            }.call(this));
          }.call(this, require('_process')));
        },
        {
          './_stream_readable': 19,
          './_stream_writable': 21,
          _process: 13,
          inherits: 10,
        },
      ],
      18: [
        function (require, module, exports) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.
          // a passthrough stream.
          // basically just the most minimal sort of Transform stream.
          // Every written chunk gets output as-is.
          'use strict';

          module.exports = PassThrough;

          var Transform = require('./_stream_transform');

          require('inherits')(PassThrough, Transform);

          function PassThrough(options) {
            if (!(this instanceof PassThrough)) return new PassThrough(options);
            Transform.call(this, options);
          }

          PassThrough.prototype._transform = function (chunk, encoding, cb) {
            cb(null, chunk);
          };
        },
        { './_stream_transform': 20, inherits: 10 },
      ],
      19: [
        function (require, module, exports) {
          (function (process, global) {
            (function () {
              // Copyright Joyent, Inc. and other Node contributors.
              //
              // Permission is hereby granted, free of charge, to any person obtaining a
              // copy of this software and associated documentation files (the
              // "Software"), to deal in the Software without restriction, including
              // without limitation the rights to use, copy, modify, merge, publish,
              // distribute, sublicense, and/or sell copies of the Software, and to permit
              // persons to whom the Software is furnished to do so, subject to the
              // following conditions:
              //
              // The above copyright notice and this permission notice shall be included
              // in all copies or substantial portions of the Software.
              //
              // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
              // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
              // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
              // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
              // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
              // USE OR OTHER DEALINGS IN THE SOFTWARE.
              'use strict';

              module.exports = Readable;
              /*<replacement>*/

              var Duplex;
              /*</replacement>*/

              Readable.ReadableState = ReadableState;
              /*<replacement>*/

              var EE = require('events').EventEmitter;

              var EElistenerCount = function EElistenerCount(emitter, type) {
                return emitter.listeners(type).length;
              };
              /*</replacement>*/

              /*<replacement>*/

              var Stream = require('./internal/streams/stream');
              /*</replacement>*/

              var Buffer = require('buffer').Buffer;

              var OurUint8Array = global.Uint8Array || function () {};

              function _uint8ArrayToBuffer(chunk) {
                return Buffer.from(chunk);
              }

              function _isUint8Array(obj) {
                return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
              }
              /*<replacement>*/

              var debugUtil = require('util');

              var debug;

              if (debugUtil && debugUtil.debuglog) {
                debug = debugUtil.debuglog('stream');
              } else {
                debug = function debug() {};
              }
              /*</replacement>*/

              var BufferList = require('./internal/streams/buffer_list');

              var destroyImpl = require('./internal/streams/destroy');

              var _require = require('./internal/streams/state'),
                getHighWaterMark = _require.getHighWaterMark;

              var _require$codes = require('../errors').codes,
                ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
                ERR_STREAM_PUSH_AFTER_EOF =
                  _require$codes.ERR_STREAM_PUSH_AFTER_EOF,
                ERR_METHOD_NOT_IMPLEMENTED =
                  _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
                ERR_STREAM_UNSHIFT_AFTER_END_EVENT =
                  _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT; // Lazy loaded to improve the startup performance.

              var StringDecoder;
              var createReadableStreamAsyncIterator;
              var from;

              require('inherits')(Readable, Stream);

              var errorOrDestroy = destroyImpl.errorOrDestroy;
              var kProxyEvents = [
                'error',
                'close',
                'destroy',
                'pause',
                'resume',
              ];

              function prependListener(emitter, event, fn) {
                // Sadly this is not cacheable as some libraries bundle their own
                // event emitter implementation with them.
                if (typeof emitter.prependListener === 'function')
                  return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
                // userland ones.  NEVER DO THIS. This is here only because this code needs
                // to continue to work with older versions of Node.js that do not include
                // the prependListener() method. The goal is to eventually remove this hack.

                if (!emitter._events || !emitter._events[event])
                  emitter.on(event, fn);
                else if (Array.isArray(emitter._events[event]))
                  emitter._events[event].unshift(fn);
                else emitter._events[event] = [fn, emitter._events[event]];
              }

              function ReadableState(options, stream, isDuplex) {
                Duplex = Duplex || require('./_stream_duplex');
                options = options || {}; // Duplex streams are both readable and writable, but share
                // the same options object.
                // However, some cases require setting options to different
                // values for the readable and the writable sides of the duplex stream.
                // These options can be provided separately as readableXXX and writableXXX.

                if (typeof isDuplex !== 'boolean')
                  isDuplex = stream instanceof Duplex; // object stream flag. Used to make read(n) ignore n and to
                // make all the buffer merging and length checks go away

                this.objectMode = !!options.objectMode;
                if (isDuplex)
                  this.objectMode =
                    this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
                // Note: 0 is a valid value, means "don't call _read preemptively ever"

                this.highWaterMark = getHighWaterMark(
                  this,
                  options,
                  'readableHighWaterMark',
                  isDuplex
                ); // A linked list is used to store data chunks instead of an array because the
                // linked list can remove elements from the beginning faster than
                // array.shift()

                this.buffer = new BufferList();
                this.length = 0;
                this.pipes = null;
                this.pipesCount = 0;
                this.flowing = null;
                this.ended = false;
                this.endEmitted = false;
                this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
                // immediately, or on a later tick.  We set this to true at first, because
                // any actions that shouldn't happen until "later" should generally also
                // not happen before the first read call.

                this.sync = true; // whenever we return null, then we set a flag to say
                // that we're awaiting a 'readable' event emission.

                this.needReadable = false;
                this.emittedReadable = false;
                this.readableListening = false;
                this.resumeScheduled = false;
                this.paused = true; // Should close be emitted on destroy. Defaults to true.

                this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'end' (and potentially 'finish')

                this.autoDestroy = !!options.autoDestroy; // has it been destroyed

                this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
                // encoding is 'binary' so we have to make this configurable.
                // Everything else in the universe uses 'utf8', though.

                this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

                this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

                this.readingMore = false;
                this.decoder = null;
                this.encoding = null;

                if (options.encoding) {
                  if (!StringDecoder)
                    StringDecoder = require('string_decoder/').StringDecoder;
                  this.decoder = new StringDecoder(options.encoding);
                  this.encoding = options.encoding;
                }
              }

              function Readable(options) {
                Duplex = Duplex || require('./_stream_duplex');
                if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
                // the ReadableState constructor, at least with V8 6.5

                var isDuplex = this instanceof Duplex;
                this._readableState = new ReadableState(
                  options,
                  this,
                  isDuplex
                ); // legacy

                this.readable = true;

                if (options) {
                  if (typeof options.read === 'function')
                    this._read = options.read;
                  if (typeof options.destroy === 'function')
                    this._destroy = options.destroy;
                }

                Stream.call(this);
              }

              Object.defineProperty(Readable.prototype, 'destroyed', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  if (this._readableState === undefined) {
                    return false;
                  }

                  return this._readableState.destroyed;
                },
                set: function set(value) {
                  // we ignore the value if the stream
                  // has not been initialized yet
                  if (!this._readableState) {
                    return;
                  } // backward compatibility, the user is explicitly
                  // managing destroyed

                  this._readableState.destroyed = value;
                },
              });
              Readable.prototype.destroy = destroyImpl.destroy;
              Readable.prototype._undestroy = destroyImpl.undestroy;

              Readable.prototype._destroy = function (err, cb) {
                cb(err);
              }; // Manually shove something into the read() buffer.
              // This returns true if the highWaterMark has not been hit yet,
              // similar to how Writable.write() returns true if you should
              // write() some more.

              Readable.prototype.push = function (chunk, encoding) {
                var state = this._readableState;
                var skipChunkCheck;

                if (!state.objectMode) {
                  if (typeof chunk === 'string') {
                    encoding = encoding || state.defaultEncoding;

                    if (encoding !== state.encoding) {
                      chunk = Buffer.from(chunk, encoding);
                      encoding = '';
                    }

                    skipChunkCheck = true;
                  }
                } else {
                  skipChunkCheck = true;
                }

                return readableAddChunk(
                  this,
                  chunk,
                  encoding,
                  false,
                  skipChunkCheck
                );
              }; // Unshift should *always* be something directly out of read()

              Readable.prototype.unshift = function (chunk) {
                return readableAddChunk(this, chunk, null, true, false);
              };

              function readableAddChunk(
                stream,
                chunk,
                encoding,
                addToFront,
                skipChunkCheck
              ) {
                debug('readableAddChunk', chunk);
                var state = stream._readableState;

                if (chunk === null) {
                  state.reading = false;
                  onEofChunk(stream, state);
                } else {
                  var er;
                  if (!skipChunkCheck) er = chunkInvalid(state, chunk);

                  if (er) {
                    errorOrDestroy(stream, er);
                  } else if (state.objectMode || (chunk && chunk.length > 0)) {
                    if (
                      typeof chunk !== 'string' &&
                      !state.objectMode &&
                      Object.getPrototypeOf(chunk) !== Buffer.prototype
                    ) {
                      chunk = _uint8ArrayToBuffer(chunk);
                    }

                    if (addToFront) {
                      if (state.endEmitted)
                        errorOrDestroy(
                          stream,
                          new ERR_STREAM_UNSHIFT_AFTER_END_EVENT()
                        );
                      else addChunk(stream, state, chunk, true);
                    } else if (state.ended) {
                      errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
                    } else if (state.destroyed) {
                      return false;
                    } else {
                      state.reading = false;

                      if (state.decoder && !encoding) {
                        chunk = state.decoder.write(chunk);
                        if (state.objectMode || chunk.length !== 0)
                          addChunk(stream, state, chunk, false);
                        else maybeReadMore(stream, state);
                      } else {
                        addChunk(stream, state, chunk, false);
                      }
                    }
                  } else if (!addToFront) {
                    state.reading = false;
                    maybeReadMore(stream, state);
                  }
                } // We can push more data if we are below the highWaterMark.
                // Also, if we have no data yet, we can stand some more bytes.
                // This is to work around cases where hwm=0, such as the repl.

                return (
                  !state.ended &&
                  (state.length < state.highWaterMark || state.length === 0)
                );
              }

              function addChunk(stream, state, chunk, addToFront) {
                if (state.flowing && state.length === 0 && !state.sync) {
                  state.awaitDrain = 0;
                  stream.emit('data', chunk);
                } else {
                  // update the buffer info.
                  state.length += state.objectMode ? 1 : chunk.length;
                  if (addToFront) state.buffer.unshift(chunk);
                  else state.buffer.push(chunk);
                  if (state.needReadable) emitReadable(stream);
                }

                maybeReadMore(stream, state);
              }

              function chunkInvalid(state, chunk) {
                var er;

                if (
                  !_isUint8Array(chunk) &&
                  typeof chunk !== 'string' &&
                  chunk !== undefined &&
                  !state.objectMode
                ) {
                  er = new ERR_INVALID_ARG_TYPE(
                    'chunk',
                    ['string', 'Buffer', 'Uint8Array'],
                    chunk
                  );
                }

                return er;
              }

              Readable.prototype.isPaused = function () {
                return this._readableState.flowing === false;
              }; // backwards compatibility.

              Readable.prototype.setEncoding = function (enc) {
                if (!StringDecoder)
                  StringDecoder = require('string_decoder/').StringDecoder;
                var decoder = new StringDecoder(enc);
                this._readableState.decoder = decoder; // If setEncoding(null), decoder.encoding equals utf8

                this._readableState.encoding =
                  this._readableState.decoder.encoding; // Iterate over current buffer to convert already stored Buffers:

                var p = this._readableState.buffer.head;
                var content = '';

                while (p !== null) {
                  content += decoder.write(p.data);
                  p = p.next;
                }

                this._readableState.buffer.clear();

                if (content !== '') this._readableState.buffer.push(content);
                this._readableState.length = content.length;
                return this;
              }; // Don't raise the hwm > 1GB

              var MAX_HWM = 0x40000000;

              function computeNewHighWaterMark(n) {
                if (n >= MAX_HWM) {
                  // TODO(ronag): Throw ERR_VALUE_OUT_OF_RANGE.
                  n = MAX_HWM;
                } else {
                  // Get the next highest power of 2 to prevent increasing hwm excessively in
                  // tiny amounts
                  n--;
                  n |= n >>> 1;
                  n |= n >>> 2;
                  n |= n >>> 4;
                  n |= n >>> 8;
                  n |= n >>> 16;
                  n++;
                }

                return n;
              } // This function is designed to be inlinable, so please take care when making
              // changes to the function body.

              function howMuchToRead(n, state) {
                if (n <= 0 || (state.length === 0 && state.ended)) return 0;
                if (state.objectMode) return 1;

                if (n !== n) {
                  // Only flow one buffer at a time
                  if (state.flowing && state.length)
                    return state.buffer.head.data.length;
                  else return state.length;
                } // If we're asking for more than the current hwm, then raise the hwm.

                if (n > state.highWaterMark)
                  state.highWaterMark = computeNewHighWaterMark(n);
                if (n <= state.length) return n; // Don't have enough

                if (!state.ended) {
                  state.needReadable = true;
                  return 0;
                }

                return state.length;
              } // you can override either this method, or the async _read(n) below.

              Readable.prototype.read = function (n) {
                debug('read', n);
                n = parseInt(n, 10);
                var state = this._readableState;
                var nOrig = n;
                if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
                // already have a bunch of data in the buffer, then just trigger
                // the 'readable' event and move on.

                if (
                  n === 0 &&
                  state.needReadable &&
                  ((state.highWaterMark !== 0
                    ? state.length >= state.highWaterMark
                    : state.length > 0) ||
                    state.ended)
                ) {
                  debug('read: emitReadable', state.length, state.ended);
                  if (state.length === 0 && state.ended) endReadable(this);
                  else emitReadable(this);
                  return null;
                }

                n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

                if (n === 0 && state.ended) {
                  if (state.length === 0) endReadable(this);
                  return null;
                } // All the actual chunk generation logic needs to be
                // *below* the call to _read.  The reason is that in certain
                // synthetic stream cases, such as passthrough streams, _read
                // may be a completely synchronous operation which may change
                // the state of the read buffer, providing enough data when
                // before there was *not* enough.
                //
                // So, the steps are:
                // 1. Figure out what the state of things will be after we do
                // a read from the buffer.
                //
                // 2. If that resulting state will trigger a _read, then call _read.
                // Note that this may be asynchronous, or synchronous.  Yes, it is
                // deeply ugly to write APIs this way, but that still doesn't mean
                // that the Readable class should behave improperly, as streams are
                // designed to be sync/async agnostic.
                // Take note if the _read call is sync or async (ie, if the read call
                // has returned yet), so that we know whether or not it's safe to emit
                // 'readable' etc.
                //
                // 3. Actually pull the requested chunks out of the buffer and return.
                // if we need a readable event, then we need to do some reading.

                var doRead = state.needReadable;
                debug('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

                if (
                  state.length === 0 ||
                  state.length - n < state.highWaterMark
                ) {
                  doRead = true;
                  debug('length less than watermark', doRead);
                } // however, if we've ended, then there's no point, and if we're already
                // reading, then it's unnecessary.

                if (state.ended || state.reading) {
                  doRead = false;
                  debug('reading or ended', doRead);
                } else if (doRead) {
                  debug('do read');
                  state.reading = true;
                  state.sync = true; // if the length is currently zero, then we *need* a readable event.

                  if (state.length === 0) state.needReadable = true; // call internal read method

                  this._read(state.highWaterMark);

                  state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
                  // and we need to re-evaluate how much data we can return to the user.

                  if (!state.reading) n = howMuchToRead(nOrig, state);
                }

                var ret;
                if (n > 0) ret = fromList(n, state);
                else ret = null;

                if (ret === null) {
                  state.needReadable = state.length <= state.highWaterMark;
                  n = 0;
                } else {
                  state.length -= n;
                  state.awaitDrain = 0;
                }

                if (state.length === 0) {
                  // If we have nothing in the buffer, then we want to know
                  // as soon as we *do* get something into the buffer.
                  if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

                  if (nOrig !== n && state.ended) endReadable(this);
                }

                if (ret !== null) this.emit('data', ret);
                return ret;
              };

              function onEofChunk(stream, state) {
                debug('onEofChunk');
                if (state.ended) return;

                if (state.decoder) {
                  var chunk = state.decoder.end();

                  if (chunk && chunk.length) {
                    state.buffer.push(chunk);
                    state.length += state.objectMode ? 1 : chunk.length;
                  }
                }

                state.ended = true;

                if (state.sync) {
                  // if we are sync, wait until next tick to emit the data.
                  // Otherwise we risk emitting data in the flow()
                  // the readable code triggers during a read() call
                  emitReadable(stream);
                } else {
                  // emit 'readable' now to make sure it gets picked up.
                  state.needReadable = false;

                  if (!state.emittedReadable) {
                    state.emittedReadable = true;
                    emitReadable_(stream);
                  }
                }
              } // Don't emit readable right away in sync mode, because this can trigger
              // another read() call => stack overflow.  This way, it might trigger
              // a nextTick recursion warning, but that's not so bad.

              function emitReadable(stream) {
                var state = stream._readableState;
                debug(
                  'emitReadable',
                  state.needReadable,
                  state.emittedReadable
                );
                state.needReadable = false;

                if (!state.emittedReadable) {
                  debug('emitReadable', state.flowing);
                  state.emittedReadable = true;
                  process.nextTick(emitReadable_, stream);
                }
              }

              function emitReadable_(stream) {
                var state = stream._readableState;
                debug(
                  'emitReadable_',
                  state.destroyed,
                  state.length,
                  state.ended
                );

                if (!state.destroyed && (state.length || state.ended)) {
                  stream.emit('readable');
                  state.emittedReadable = false;
                } // The stream needs another readable event if
                // 1. It is not flowing, as the flow mechanism will take
                //    care of it.
                // 2. It is not ended.
                // 3. It is below the highWaterMark, so we can schedule
                //    another readable later.

                state.needReadable =
                  !state.flowing &&
                  !state.ended &&
                  state.length <= state.highWaterMark;
                flow(stream);
              } // at this point, the user has presumably seen the 'readable' event,
              // and called read() to consume some data.  that may have triggered
              // in turn another _read(n) call, in which case reading = true if
              // it's in progress.
              // However, if we're not ended, or reading, and the length < hwm,
              // then go ahead and try to read some more preemptively.

              function maybeReadMore(stream, state) {
                if (!state.readingMore) {
                  state.readingMore = true;
                  process.nextTick(maybeReadMore_, stream, state);
                }
              }

              function maybeReadMore_(stream, state) {
                // Attempt to read more data if we should.
                //
                // The conditions for reading more data are (one of):
                // - Not enough data buffered (state.length < state.highWaterMark). The loop
                //   is responsible for filling the buffer with enough data if such data
                //   is available. If highWaterMark is 0 and we are not in the flowing mode
                //   we should _not_ attempt to buffer any extra data. We'll get more data
                //   when the stream consumer calls read() instead.
                // - No data in the buffer, and the stream is in flowing mode. In this mode
                //   the loop below is responsible for ensuring read() is called. Failing to
                //   call read here would abort the flow and there's no other mechanism for
                //   continuing the flow if the stream consumer has just subscribed to the
                //   'data' event.
                //
                // In addition to the above conditions to keep reading data, the following
                // conditions prevent the data from being read:
                // - The stream has ended (state.ended).
                // - There is already a pending 'read' operation (state.reading). This is a
                //   case where the the stream has called the implementation defined _read()
                //   method, but they are processing the call asynchronously and have _not_
                //   called push() with new data. In this case we skip performing more
                //   read()s. The execution ends in this method again after the _read() ends
                //   up calling push() with more data.
                while (
                  !state.reading &&
                  !state.ended &&
                  (state.length < state.highWaterMark ||
                    (state.flowing && state.length === 0))
                ) {
                  var len = state.length;
                  debug('maybeReadMore read 0');
                  stream.read(0);
                  if (len === state.length)
                    // didn't get any data, stop spinning.
                    break;
                }

                state.readingMore = false;
              } // abstract method.  to be overridden in specific implementation classes.
              // call cb(er, data) where data is <= n in length.
              // for virtual (non-string, non-buffer) streams, "length" is somewhat
              // arbitrary, and perhaps not very meaningful.

              Readable.prototype._read = function (n) {
                errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED('_read()'));
              };

              Readable.prototype.pipe = function (dest, pipeOpts) {
                var src = this;
                var state = this._readableState;

                switch (state.pipesCount) {
                  case 0:
                    state.pipes = dest;
                    break;

                  case 1:
                    state.pipes = [state.pipes, dest];
                    break;

                  default:
                    state.pipes.push(dest);
                    break;
                }

                state.pipesCount += 1;
                debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
                var doEnd =
                  (!pipeOpts || pipeOpts.end !== false) &&
                  dest !== process.stdout &&
                  dest !== process.stderr;
                var endFn = doEnd ? onend : unpipe;
                if (state.endEmitted) process.nextTick(endFn);
                else src.once('end', endFn);
                dest.on('unpipe', onunpipe);

                function onunpipe(readable, unpipeInfo) {
                  debug('onunpipe');

                  if (readable === src) {
                    if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
                      unpipeInfo.hasUnpiped = true;
                      cleanup();
                    }
                  }
                }

                function onend() {
                  debug('onend');
                  dest.end();
                } // when the dest drains, it reduces the awaitDrain counter
                // on the source.  This would be more elegant with a .once()
                // handler in flow(), but adding and removing repeatedly is
                // too slow.

                var ondrain = pipeOnDrain(src);
                dest.on('drain', ondrain);
                var cleanedUp = false;

                function cleanup() {
                  debug('cleanup'); // cleanup event handlers once the pipe is broken

                  dest.removeListener('close', onclose);
                  dest.removeListener('finish', onfinish);
                  dest.removeListener('drain', ondrain);
                  dest.removeListener('error', onerror);
                  dest.removeListener('unpipe', onunpipe);
                  src.removeListener('end', onend);
                  src.removeListener('end', unpipe);
                  src.removeListener('data', ondata);
                  cleanedUp = true; // if the reader is waiting for a drain event from this
                  // specific writer, then it would cause it to never start
                  // flowing again.
                  // So, if this is awaiting a drain, then we just call it now.
                  // If we don't know, then assume that we are waiting for one.

                  if (
                    state.awaitDrain &&
                    (!dest._writableState || dest._writableState.needDrain)
                  )
                    ondrain();
                }

                src.on('data', ondata);

                function ondata(chunk) {
                  debug('ondata');
                  var ret = dest.write(chunk);
                  debug('dest.write', ret);

                  if (ret === false) {
                    // If the user unpiped during `dest.write()`, it is possible
                    // to get stuck in a permanently paused state if that write
                    // also returned false.
                    // => Check whether `dest` is still a piping destination.
                    if (
                      ((state.pipesCount === 1 && state.pipes === dest) ||
                        (state.pipesCount > 1 &&
                          indexOf(state.pipes, dest) !== -1)) &&
                      !cleanedUp
                    ) {
                      debug('false write response, pause', state.awaitDrain);
                      state.awaitDrain++;
                    }

                    src.pause();
                  }
                } // if the dest has an error, then stop piping into it.
                // however, don't suppress the throwing behavior for this.

                function onerror(er) {
                  debug('onerror', er);
                  unpipe();
                  dest.removeListener('error', onerror);
                  if (EElistenerCount(dest, 'error') === 0)
                    errorOrDestroy(dest, er);
                } // Make sure our error handler is attached before userland ones.

                prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

                function onclose() {
                  dest.removeListener('finish', onfinish);
                  unpipe();
                }

                dest.once('close', onclose);

                function onfinish() {
                  debug('onfinish');
                  dest.removeListener('close', onclose);
                  unpipe();
                }

                dest.once('finish', onfinish);

                function unpipe() {
                  debug('unpipe');
                  src.unpipe(dest);
                } // tell the dest that it's being piped to

                dest.emit('pipe', src); // start the flow if it hasn't been started already.

                if (!state.flowing) {
                  debug('pipe resume');
                  src.resume();
                }

                return dest;
              };

              function pipeOnDrain(src) {
                return function pipeOnDrainFunctionResult() {
                  var state = src._readableState;
                  debug('pipeOnDrain', state.awaitDrain);
                  if (state.awaitDrain) state.awaitDrain--;

                  if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
                    state.flowing = true;
                    flow(src);
                  }
                };
              }

              Readable.prototype.unpipe = function (dest) {
                var state = this._readableState;
                var unpipeInfo = {
                  hasUnpiped: false,
                }; // if we're not piping anywhere, then do nothing.

                if (state.pipesCount === 0) return this; // just one destination.  most common case.

                if (state.pipesCount === 1) {
                  // passed in one, but it's not the right one.
                  if (dest && dest !== state.pipes) return this;
                  if (!dest) dest = state.pipes; // got a match.

                  state.pipes = null;
                  state.pipesCount = 0;
                  state.flowing = false;
                  if (dest) dest.emit('unpipe', this, unpipeInfo);
                  return this;
                } // slow case. multiple pipe destinations.

                if (!dest) {
                  // remove all.
                  var dests = state.pipes;
                  var len = state.pipesCount;
                  state.pipes = null;
                  state.pipesCount = 0;
                  state.flowing = false;

                  for (var i = 0; i < len; i++) {
                    dests[i].emit('unpipe', this, {
                      hasUnpiped: false,
                    });
                  }

                  return this;
                } // try to find the right one.

                var index = indexOf(state.pipes, dest);
                if (index === -1) return this;
                state.pipes.splice(index, 1);
                state.pipesCount -= 1;
                if (state.pipesCount === 1) state.pipes = state.pipes[0];
                dest.emit('unpipe', this, unpipeInfo);
                return this;
              }; // set up data events if they are asked for
              // Ensure readable listeners eventually get something

              Readable.prototype.on = function (ev, fn) {
                var res = Stream.prototype.on.call(this, ev, fn);
                var state = this._readableState;

                if (ev === 'data') {
                  // update readableListening so that resume() may be a no-op
                  // a few lines down. This is needed to support once('readable').
                  state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

                  if (state.flowing !== false) this.resume();
                } else if (ev === 'readable') {
                  if (!state.endEmitted && !state.readableListening) {
                    state.readableListening = state.needReadable = true;
                    state.flowing = false;
                    state.emittedReadable = false;
                    debug('on readable', state.length, state.reading);

                    if (state.length) {
                      emitReadable(this);
                    } else if (!state.reading) {
                      process.nextTick(nReadingNextTick, this);
                    }
                  }
                }

                return res;
              };

              Readable.prototype.addListener = Readable.prototype.on;

              Readable.prototype.removeListener = function (ev, fn) {
                var res = Stream.prototype.removeListener.call(this, ev, fn);

                if (ev === 'readable') {
                  // We need to check if there is someone still listening to
                  // readable and reset the state. However this needs to happen
                  // after readable has been emitted but before I/O (nextTick) to
                  // support once('readable', fn) cycles. This means that calling
                  // resume within the same tick will have no
                  // effect.
                  process.nextTick(updateReadableListening, this);
                }

                return res;
              };

              Readable.prototype.removeAllListeners = function (ev) {
                var res = Stream.prototype.removeAllListeners.apply(
                  this,
                  arguments
                );

                if (ev === 'readable' || ev === undefined) {
                  // We need to check if there is someone still listening to
                  // readable and reset the state. However this needs to happen
                  // after readable has been emitted but before I/O (nextTick) to
                  // support once('readable', fn) cycles. This means that calling
                  // resume within the same tick will have no
                  // effect.
                  process.nextTick(updateReadableListening, this);
                }

                return res;
              };

              function updateReadableListening(self) {
                var state = self._readableState;
                state.readableListening = self.listenerCount('readable') > 0;

                if (state.resumeScheduled && !state.paused) {
                  // flowing needs to be set to true now, otherwise
                  // the upcoming resume will not flow.
                  state.flowing = true; // crude way to check if we should resume
                } else if (self.listenerCount('data') > 0) {
                  self.resume();
                }
              }

              function nReadingNextTick(self) {
                debug('readable nexttick read 0');
                self.read(0);
              } // pause() and resume() are remnants of the legacy readable stream API
              // If the user uses them, then switch into old mode.

              Readable.prototype.resume = function () {
                var state = this._readableState;

                if (!state.flowing) {
                  debug('resume'); // we flow only if there is no one listening
                  // for readable, but we still have to call
                  // resume()

                  state.flowing = !state.readableListening;
                  resume(this, state);
                }

                state.paused = false;
                return this;
              };

              function resume(stream, state) {
                if (!state.resumeScheduled) {
                  state.resumeScheduled = true;
                  process.nextTick(resume_, stream, state);
                }
              }

              function resume_(stream, state) {
                debug('resume', state.reading);

                if (!state.reading) {
                  stream.read(0);
                }

                state.resumeScheduled = false;
                stream.emit('resume');
                flow(stream);
                if (state.flowing && !state.reading) stream.read(0);
              }

              Readable.prototype.pause = function () {
                debug('call pause flowing=%j', this._readableState.flowing);

                if (this._readableState.flowing !== false) {
                  debug('pause');
                  this._readableState.flowing = false;
                  this.emit('pause');
                }

                this._readableState.paused = true;
                return this;
              };

              function flow(stream) {
                var state = stream._readableState;
                debug('flow', state.flowing);

                while (state.flowing && stream.read() !== null) {}
              } // wrap an old-style stream as the async data source.
              // This is *not* part of the readable stream interface.
              // It is an ugly unfortunate mess of history.

              Readable.prototype.wrap = function (stream) {
                var _this = this;

                var state = this._readableState;
                var paused = false;
                stream.on('end', function () {
                  debug('wrapped end');

                  if (state.decoder && !state.ended) {
                    var chunk = state.decoder.end();
                    if (chunk && chunk.length) _this.push(chunk);
                  }

                  _this.push(null);
                });
                stream.on('data', function (chunk) {
                  debug('wrapped data');
                  if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

                  if (
                    state.objectMode &&
                    (chunk === null || chunk === undefined)
                  )
                    return;
                  else if (!state.objectMode && (!chunk || !chunk.length))
                    return;

                  var ret = _this.push(chunk);

                  if (!ret) {
                    paused = true;
                    stream.pause();
                  }
                }); // proxy all the other methods.
                // important when wrapping filters and duplexes.

                for (var i in stream) {
                  if (
                    this[i] === undefined &&
                    typeof stream[i] === 'function'
                  ) {
                    this[i] = (function methodWrap(method) {
                      return function methodWrapReturnFunction() {
                        return stream[method].apply(stream, arguments);
                      };
                    })(i);
                  }
                } // proxy certain important events.

                for (var n = 0; n < kProxyEvents.length; n++) {
                  stream.on(
                    kProxyEvents[n],
                    this.emit.bind(this, kProxyEvents[n])
                  );
                } // when we try to consume some more bytes, simply unpause the
                // underlying stream.

                this._read = function (n) {
                  debug('wrapped _read', n);

                  if (paused) {
                    paused = false;
                    stream.resume();
                  }
                };

                return this;
              };

              if (typeof Symbol === 'function') {
                Readable.prototype[Symbol.asyncIterator] = function () {
                  if (createReadableStreamAsyncIterator === undefined) {
                    createReadableStreamAsyncIterator = require('./internal/streams/async_iterator');
                  }

                  return createReadableStreamAsyncIterator(this);
                };
              }

              Object.defineProperty(
                Readable.prototype,
                'readableHighWaterMark',
                {
                  // making it explicit this property is not enumerable
                  // because otherwise some prototype manipulation in
                  // userland will fail
                  enumerable: false,
                  get: function get() {
                    return this._readableState.highWaterMark;
                  },
                }
              );
              Object.defineProperty(Readable.prototype, 'readableBuffer', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  return this._readableState && this._readableState.buffer;
                },
              });
              Object.defineProperty(Readable.prototype, 'readableFlowing', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  return this._readableState.flowing;
                },
                set: function set(state) {
                  if (this._readableState) {
                    this._readableState.flowing = state;
                  }
                },
              }); // exposed for testing purposes only.

              Readable._fromList = fromList;
              Object.defineProperty(Readable.prototype, 'readableLength', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  return this._readableState.length;
                },
              }); // Pluck off n bytes from an array of buffers.
              // Length is the combined lengths of all the buffers in the list.
              // This function is designed to be inlinable, so please take care when making
              // changes to the function body.

              function fromList(n, state) {
                // nothing buffered
                if (state.length === 0) return null;
                var ret;
                if (state.objectMode) ret = state.buffer.shift();
                else if (!n || n >= state.length) {
                  // read it all, truncate the list
                  if (state.decoder) ret = state.buffer.join('');
                  else if (state.buffer.length === 1)
                    ret = state.buffer.first();
                  else ret = state.buffer.concat(state.length);
                  state.buffer.clear();
                } else {
                  // read part of list
                  ret = state.buffer.consume(n, state.decoder);
                }
                return ret;
              }

              function endReadable(stream) {
                var state = stream._readableState;
                debug('endReadable', state.endEmitted);

                if (!state.endEmitted) {
                  state.ended = true;
                  process.nextTick(endReadableNT, state, stream);
                }
              }

              function endReadableNT(state, stream) {
                debug('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

                if (!state.endEmitted && state.length === 0) {
                  state.endEmitted = true;
                  stream.readable = false;
                  stream.emit('end');

                  if (state.autoDestroy) {
                    // In case of duplex streams we need a way to detect
                    // if the writable side is ready for autoDestroy as well
                    var wState = stream._writableState;

                    if (!wState || (wState.autoDestroy && wState.finished)) {
                      stream.destroy();
                    }
                  }
                }
              }

              if (typeof Symbol === 'function') {
                Readable.from = function (iterable, opts) {
                  if (from === undefined) {
                    from = require('./internal/streams/from');
                  }

                  return from(Readable, iterable, opts);
                };
              }

              function indexOf(xs, x) {
                for (var i = 0, l = xs.length; i < l; i++) {
                  if (xs[i] === x) return i;
                }

                return -1;
              }
            }.call(this));
          }.call(
            this,
            require('_process'),
            typeof global !== 'undefined'
              ? global
              : typeof self !== 'undefined'
              ? self
              : typeof window !== 'undefined'
              ? window
              : {}
          ));
        },
        {
          '../errors': 16,
          './_stream_duplex': 17,
          './internal/streams/async_iterator': 22,
          './internal/streams/buffer_list': 23,
          './internal/streams/destroy': 24,
          './internal/streams/from': 26,
          './internal/streams/state': 28,
          './internal/streams/stream': 29,
          _process: 13,
          buffer: 7,
          events: 8,
          inherits: 10,
          'string_decoder/': 30,
          util: 6,
        },
      ],
      20: [
        function (require, module, exports) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.
          // a transform stream is a readable/writable stream where you do
          // something with the data.  Sometimes it's called a "filter",
          // but that's not a great name for it, since that implies a thing where
          // some bits pass through, and others are simply ignored.  (That would
          // be a valid example of a transform, of course.)
          //
          // While the output is causally related to the input, it's not a
          // necessarily symmetric or synchronous transformation.  For example,
          // a zlib stream might take multiple plain-text writes(), and then
          // emit a single compressed chunk some time in the future.
          //
          // Here's how this works:
          //
          // The Transform stream has all the aspects of the readable and writable
          // stream classes.  When you write(chunk), that calls _write(chunk,cb)
          // internally, and returns false if there's a lot of pending writes
          // buffered up.  When you call read(), that calls _read(n) until
          // there's enough pending readable data buffered up.
          //
          // In a transform stream, the written data is placed in a buffer.  When
          // _read(n) is called, it transforms the queued up data, calling the
          // buffered _write cb's as it consumes chunks.  If consuming a single
          // written chunk would result in multiple output chunks, then the first
          // outputted bit calls the readcb, and subsequent chunks just go into
          // the read buffer, and will cause it to emit 'readable' if necessary.
          //
          // This way, back-pressure is actually determined by the reading side,
          // since _read has to be called to start processing a new chunk.  However,
          // a pathological inflate type of transform can cause excessive buffering
          // here.  For example, imagine a stream where every byte of input is
          // interpreted as an integer from 0-255, and then results in that many
          // bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
          // 1kb of data being output.  In this case, you could write a very small
          // amount of input, and end up with a very large amount of output.  In
          // such a pathological inflating mechanism, there'd be no way to tell
          // the system to stop doing the transform.  A single 4MB write could
          // cause the system to run out of memory.
          //
          // However, even in such a pathological case, only a single written chunk
          // would be consumed, and then the rest would wait (un-transformed) until
          // the results of the previous transformed chunk were consumed.
          'use strict';

          module.exports = Transform;

          var _require$codes = require('../errors').codes,
            ERR_METHOD_NOT_IMPLEMENTED =
              _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
            ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
            ERR_TRANSFORM_ALREADY_TRANSFORMING =
              _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING,
            ERR_TRANSFORM_WITH_LENGTH_0 =
              _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;

          var Duplex = require('./_stream_duplex');

          require('inherits')(Transform, Duplex);

          function afterTransform(er, data) {
            var ts = this._transformState;
            ts.transforming = false;
            var cb = ts.writecb;

            if (cb === null) {
              return this.emit('error', new ERR_MULTIPLE_CALLBACK());
            }

            ts.writechunk = null;
            ts.writecb = null;
            if (data != null)
              // single equals check for both `null` and `undefined`
              this.push(data);
            cb(er);
            var rs = this._readableState;
            rs.reading = false;

            if (rs.needReadable || rs.length < rs.highWaterMark) {
              this._read(rs.highWaterMark);
            }
          }

          function Transform(options) {
            if (!(this instanceof Transform)) return new Transform(options);
            Duplex.call(this, options);
            this._transformState = {
              afterTransform: afterTransform.bind(this),
              needTransform: false,
              transforming: false,
              writecb: null,
              writechunk: null,
              writeencoding: null,
            }; // start out asking for a readable event once data is transformed.

            this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
            // that Readable wants before the first _read call, so unset the
            // sync guard flag.

            this._readableState.sync = false;

            if (options) {
              if (typeof options.transform === 'function')
                this._transform = options.transform;
              if (typeof options.flush === 'function')
                this._flush = options.flush;
            } // When the writable side finishes, then flush out anything remaining.

            this.on('prefinish', prefinish);
          }

          function prefinish() {
            var _this = this;

            if (
              typeof this._flush === 'function' &&
              !this._readableState.destroyed
            ) {
              this._flush(function (er, data) {
                done(_this, er, data);
              });
            } else {
              done(this, null, null);
            }
          }

          Transform.prototype.push = function (chunk, encoding) {
            this._transformState.needTransform = false;
            return Duplex.prototype.push.call(this, chunk, encoding);
          }; // This is the part where you do stuff!
          // override this function in implementation classes.
          // 'chunk' is an input chunk.
          //
          // Call `push(newChunk)` to pass along transformed output
          // to the readable side.  You may call 'push' zero or more times.
          //
          // Call `cb(err)` when you are done with this chunk.  If you pass
          // an error, then that'll put the hurt on the whole operation.  If you
          // never call cb(), then you'll never get another chunk.

          Transform.prototype._transform = function (chunk, encoding, cb) {
            cb(new ERR_METHOD_NOT_IMPLEMENTED('_transform()'));
          };

          Transform.prototype._write = function (chunk, encoding, cb) {
            var ts = this._transformState;
            ts.writecb = cb;
            ts.writechunk = chunk;
            ts.writeencoding = encoding;

            if (!ts.transforming) {
              var rs = this._readableState;
              if (
                ts.needTransform ||
                rs.needReadable ||
                rs.length < rs.highWaterMark
              )
                this._read(rs.highWaterMark);
            }
          }; // Doesn't matter what the args are here.
          // _transform does all the work.
          // That we got here means that the readable side wants more data.

          Transform.prototype._read = function (n) {
            var ts = this._transformState;

            if (ts.writechunk !== null && !ts.transforming) {
              ts.transforming = true;

              this._transform(
                ts.writechunk,
                ts.writeencoding,
                ts.afterTransform
              );
            } else {
              // mark that we need a transform, so that any data that comes in
              // will get processed, now that we've asked for it.
              ts.needTransform = true;
            }
          };

          Transform.prototype._destroy = function (err, cb) {
            Duplex.prototype._destroy.call(this, err, function (err2) {
              cb(err2);
            });
          };

          function done(stream, er, data) {
            if (er) return stream.emit('error', er);
            if (data != null)
              // single equals check for both `null` and `undefined`
              stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
            // if there's nothing in the write buffer, then that means
            // that nothing more will ever be provided

            if (stream._writableState.length)
              throw new ERR_TRANSFORM_WITH_LENGTH_0();
            if (stream._transformState.transforming)
              throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
            return stream.push(null);
          }
        },
        { '../errors': 16, './_stream_duplex': 17, inherits: 10 },
      ],
      21: [
        function (require, module, exports) {
          (function (process, global) {
            (function () {
              // Copyright Joyent, Inc. and other Node contributors.
              //
              // Permission is hereby granted, free of charge, to any person obtaining a
              // copy of this software and associated documentation files (the
              // "Software"), to deal in the Software without restriction, including
              // without limitation the rights to use, copy, modify, merge, publish,
              // distribute, sublicense, and/or sell copies of the Software, and to permit
              // persons to whom the Software is furnished to do so, subject to the
              // following conditions:
              //
              // The above copyright notice and this permission notice shall be included
              // in all copies or substantial portions of the Software.
              //
              // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
              // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
              // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
              // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
              // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
              // USE OR OTHER DEALINGS IN THE SOFTWARE.
              // A bit simpler than readable streams.
              // Implement an async ._write(chunk, encoding, cb), and it'll handle all
              // the drain event emission and buffering.
              'use strict';

              module.exports = Writable;
              /* <replacement> */

              function WriteReq(chunk, encoding, cb) {
                this.chunk = chunk;
                this.encoding = encoding;
                this.callback = cb;
                this.next = null;
              } // It seems a linked list but it is not
              // there will be only 2 of these for each stream

              function CorkedRequest(state) {
                var _this = this;

                this.next = null;
                this.entry = null;

                this.finish = function () {
                  onCorkedFinish(_this, state);
                };
              }
              /* </replacement> */

              /*<replacement>*/

              var Duplex;
              /*</replacement>*/

              Writable.WritableState = WritableState;
              /*<replacement>*/

              var internalUtil = {
                deprecate: require('util-deprecate'),
              };
              /*</replacement>*/

              /*<replacement>*/

              var Stream = require('./internal/streams/stream');
              /*</replacement>*/

              var Buffer = require('buffer').Buffer;

              var OurUint8Array = global.Uint8Array || function () {};

              function _uint8ArrayToBuffer(chunk) {
                return Buffer.from(chunk);
              }

              function _isUint8Array(obj) {
                return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
              }

              var destroyImpl = require('./internal/streams/destroy');

              var _require = require('./internal/streams/state'),
                getHighWaterMark = _require.getHighWaterMark;

              var _require$codes = require('../errors').codes,
                ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
                ERR_METHOD_NOT_IMPLEMENTED =
                  _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
                ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
                ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
                ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
                ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
                ERR_STREAM_WRITE_AFTER_END =
                  _require$codes.ERR_STREAM_WRITE_AFTER_END,
                ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;

              var errorOrDestroy = destroyImpl.errorOrDestroy;

              require('inherits')(Writable, Stream);

              function nop() {}

              function WritableState(options, stream, isDuplex) {
                Duplex = Duplex || require('./_stream_duplex');
                options = options || {}; // Duplex streams are both readable and writable, but share
                // the same options object.
                // However, some cases require setting options to different
                // values for the readable and the writable sides of the duplex stream,
                // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

                if (typeof isDuplex !== 'boolean')
                  isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
                // contains buffers or objects.

                this.objectMode = !!options.objectMode;
                if (isDuplex)
                  this.objectMode =
                    this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
                // Note: 0 is a valid value, means that we always return false if
                // the entire buffer is not flushed immediately on write()

                this.highWaterMark = getHighWaterMark(
                  this,
                  options,
                  'writableHighWaterMark',
                  isDuplex
                ); // if _final has been called

                this.finalCalled = false; // drain event flag.

                this.needDrain = false; // at the start of calling end()

                this.ending = false; // when end() has been called, and returned

                this.ended = false; // when 'finish' is emitted

                this.finished = false; // has it been destroyed

                this.destroyed = false; // should we decode strings into buffers before passing to _write?
                // this is here so that some node-core streams can optimize string
                // handling at a lower level.

                var noDecode = options.decodeStrings === false;
                this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
                // encoding is 'binary' so we have to make this configurable.
                // Everything else in the universe uses 'utf8', though.

                this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
                // of how much we're waiting to get pushed to some underlying
                // socket or file.

                this.length = 0; // a flag to see when we're in the middle of a write.

                this.writing = false; // when true all writes will be buffered until .uncork() call

                this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
                // or on a later tick.  We set this to true at first, because any
                // actions that shouldn't happen until "later" should generally also
                // not happen before the first write call.

                this.sync = true; // a flag to know if we're processing previously buffered items, which
                // may call the _write() callback in the same tick, so that we don't
                // end up in an overlapped onwrite situation.

                this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

                this.onwrite = function (er) {
                  onwrite(stream, er);
                }; // the callback that the user supplies to write(chunk,encoding,cb)

                this.writecb = null; // the amount that is being written when _write is called.

                this.writelen = 0;
                this.bufferedRequest = null;
                this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
                // this must be 0 before 'finish' can be emitted

                this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
                // This is relevant for synchronous Transform streams

                this.prefinished = false; // True if the error was already emitted and should not be thrown again

                this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

                this.emitClose = options.emitClose !== false; // Should .destroy() be called after 'finish' (and potentially 'end')

                this.autoDestroy = !!options.autoDestroy; // count buffered requests

                this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
                // one allocated and free to use, and we maintain at most two

                this.corkedRequestsFree = new CorkedRequest(this);
              }

              WritableState.prototype.getBuffer = function getBuffer() {
                var current = this.bufferedRequest;
                var out = [];

                while (current) {
                  out.push(current);
                  current = current.next;
                }

                return out;
              };

              (function () {
                try {
                  Object.defineProperty(WritableState.prototype, 'buffer', {
                    get: internalUtil.deprecate(
                      function writableStateBufferGetter() {
                        return this.getBuffer();
                      },
                      '_writableState.buffer is deprecated. Use _writableState.getBuffer ' +
                        'instead.',
                      'DEP0003'
                    ),
                  });
                } catch (_) {}
              })(); // Test _writableState for inheritance to account for Duplex streams,
              // whose prototype chain only points to Readable.

              var realHasInstance;

              if (
                typeof Symbol === 'function' &&
                Symbol.hasInstance &&
                typeof Function.prototype[Symbol.hasInstance] === 'function'
              ) {
                realHasInstance = Function.prototype[Symbol.hasInstance];
                Object.defineProperty(Writable, Symbol.hasInstance, {
                  value: function value(object) {
                    if (realHasInstance.call(this, object)) return true;
                    if (this !== Writable) return false;
                    return (
                      object && object._writableState instanceof WritableState
                    );
                  },
                });
              } else {
                realHasInstance = function realHasInstance(object) {
                  return object instanceof this;
                };
              }

              function Writable(options) {
                Duplex = Duplex || require('./_stream_duplex'); // Writable ctor is applied to Duplexes, too.
                // `realHasInstance` is necessary because using plain `instanceof`
                // would return false, as no `_writableState` property is attached.
                // Trying to use the custom `instanceof` for Writable here will also break the
                // Node.js LazyTransform implementation, which has a non-trivial getter for
                // `_writableState` that would lead to infinite recursion.
                // Checking for a Stream.Duplex instance is faster here instead of inside
                // the WritableState constructor, at least with V8 6.5

                var isDuplex = this instanceof Duplex;
                if (!isDuplex && !realHasInstance.call(Writable, this))
                  return new Writable(options);
                this._writableState = new WritableState(
                  options,
                  this,
                  isDuplex
                ); // legacy.

                this.writable = true;

                if (options) {
                  if (typeof options.write === 'function')
                    this._write = options.write;
                  if (typeof options.writev === 'function')
                    this._writev = options.writev;
                  if (typeof options.destroy === 'function')
                    this._destroy = options.destroy;
                  if (typeof options.final === 'function')
                    this._final = options.final;
                }

                Stream.call(this);
              } // Otherwise people can pipe Writable streams, which is just wrong.

              Writable.prototype.pipe = function () {
                errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
              };

              function writeAfterEnd(stream, cb) {
                var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

                errorOrDestroy(stream, er);
                process.nextTick(cb, er);
              } // Checks that a user-supplied chunk is valid, especially for the particular
              // mode the stream is in. Currently this means that `null` is never accepted
              // and undefined/non-string values are only allowed in object mode.

              function validChunk(stream, state, chunk, cb) {
                var er;

                if (chunk === null) {
                  er = new ERR_STREAM_NULL_VALUES();
                } else if (typeof chunk !== 'string' && !state.objectMode) {
                  er = new ERR_INVALID_ARG_TYPE(
                    'chunk',
                    ['string', 'Buffer'],
                    chunk
                  );
                }

                if (er) {
                  errorOrDestroy(stream, er);
                  process.nextTick(cb, er);
                  return false;
                }

                return true;
              }

              Writable.prototype.write = function (chunk, encoding, cb) {
                var state = this._writableState;
                var ret = false;

                var isBuf = !state.objectMode && _isUint8Array(chunk);

                if (isBuf && !Buffer.isBuffer(chunk)) {
                  chunk = _uint8ArrayToBuffer(chunk);
                }

                if (typeof encoding === 'function') {
                  cb = encoding;
                  encoding = null;
                }

                if (isBuf) encoding = 'buffer';
                else if (!encoding) encoding = state.defaultEncoding;
                if (typeof cb !== 'function') cb = nop;
                if (state.ending) writeAfterEnd(this, cb);
                else if (isBuf || validChunk(this, state, chunk, cb)) {
                  state.pendingcb++;
                  ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
                }
                return ret;
              };

              Writable.prototype.cork = function () {
                this._writableState.corked++;
              };

              Writable.prototype.uncork = function () {
                var state = this._writableState;

                if (state.corked) {
                  state.corked--;
                  if (
                    !state.writing &&
                    !state.corked &&
                    !state.bufferProcessing &&
                    state.bufferedRequest
                  )
                    clearBuffer(this, state);
                }
              };

              Writable.prototype.setDefaultEncoding =
                function setDefaultEncoding(encoding) {
                  // node::ParseEncoding() requires lower case.
                  if (typeof encoding === 'string')
                    encoding = encoding.toLowerCase();
                  if (
                    !(
                      [
                        'hex',
                        'utf8',
                        'utf-8',
                        'ascii',
                        'binary',
                        'base64',
                        'ucs2',
                        'ucs-2',
                        'utf16le',
                        'utf-16le',
                        'raw',
                      ].indexOf((encoding + '').toLowerCase()) > -1
                    )
                  )
                    throw new ERR_UNKNOWN_ENCODING(encoding);
                  this._writableState.defaultEncoding = encoding;
                  return this;
                };

              Object.defineProperty(Writable.prototype, 'writableBuffer', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  return this._writableState && this._writableState.getBuffer();
                },
              });

              function decodeChunk(state, chunk, encoding) {
                if (
                  !state.objectMode &&
                  state.decodeStrings !== false &&
                  typeof chunk === 'string'
                ) {
                  chunk = Buffer.from(chunk, encoding);
                }

                return chunk;
              }

              Object.defineProperty(
                Writable.prototype,
                'writableHighWaterMark',
                {
                  // making it explicit this property is not enumerable
                  // because otherwise some prototype manipulation in
                  // userland will fail
                  enumerable: false,
                  get: function get() {
                    return this._writableState.highWaterMark;
                  },
                }
              ); // if we're already writing something, then just put this
              // in the queue, and wait our turn.  Otherwise, call _write
              // If we return false, then we need a drain event, so set that flag.

              function writeOrBuffer(
                stream,
                state,
                isBuf,
                chunk,
                encoding,
                cb
              ) {
                if (!isBuf) {
                  var newChunk = decodeChunk(state, chunk, encoding);

                  if (chunk !== newChunk) {
                    isBuf = true;
                    encoding = 'buffer';
                    chunk = newChunk;
                  }
                }

                var len = state.objectMode ? 1 : chunk.length;
                state.length += len;
                var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

                if (!ret) state.needDrain = true;

                if (state.writing || state.corked) {
                  var last = state.lastBufferedRequest;
                  state.lastBufferedRequest = {
                    chunk: chunk,
                    encoding: encoding,
                    isBuf: isBuf,
                    callback: cb,
                    next: null,
                  };

                  if (last) {
                    last.next = state.lastBufferedRequest;
                  } else {
                    state.bufferedRequest = state.lastBufferedRequest;
                  }

                  state.bufferedRequestCount += 1;
                } else {
                  doWrite(stream, state, false, len, chunk, encoding, cb);
                }

                return ret;
              }

              function doWrite(
                stream,
                state,
                writev,
                len,
                chunk,
                encoding,
                cb
              ) {
                state.writelen = len;
                state.writecb = cb;
                state.writing = true;
                state.sync = true;
                if (state.destroyed)
                  state.onwrite(new ERR_STREAM_DESTROYED('write'));
                else if (writev) stream._writev(chunk, state.onwrite);
                else stream._write(chunk, encoding, state.onwrite);
                state.sync = false;
              }

              function onwriteError(stream, state, sync, er, cb) {
                --state.pendingcb;

                if (sync) {
                  // defer the callback if we are being called synchronously
                  // to avoid piling up things on the stack
                  process.nextTick(cb, er); // this can emit finish, and it will always happen
                  // after error

                  process.nextTick(finishMaybe, stream, state);
                  stream._writableState.errorEmitted = true;
                  errorOrDestroy(stream, er);
                } else {
                  // the caller expect this to happen before if
                  // it is async
                  cb(er);
                  stream._writableState.errorEmitted = true;
                  errorOrDestroy(stream, er); // this can emit finish, but finish must
                  // always follow error

                  finishMaybe(stream, state);
                }
              }

              function onwriteStateUpdate(state) {
                state.writing = false;
                state.writecb = null;
                state.length -= state.writelen;
                state.writelen = 0;
              }

              function onwrite(stream, er) {
                var state = stream._writableState;
                var sync = state.sync;
                var cb = state.writecb;
                if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
                onwriteStateUpdate(state);
                if (er) onwriteError(stream, state, sync, er, cb);
                else {
                  // Check if we're actually ready to finish, but don't emit yet
                  var finished = needFinish(state) || stream.destroyed;

                  if (
                    !finished &&
                    !state.corked &&
                    !state.bufferProcessing &&
                    state.bufferedRequest
                  ) {
                    clearBuffer(stream, state);
                  }

                  if (sync) {
                    process.nextTick(afterWrite, stream, state, finished, cb);
                  } else {
                    afterWrite(stream, state, finished, cb);
                  }
                }
              }

              function afterWrite(stream, state, finished, cb) {
                if (!finished) onwriteDrain(stream, state);
                state.pendingcb--;
                cb();
                finishMaybe(stream, state);
              } // Must force callback to be called on nextTick, so that we don't
              // emit 'drain' before the write() consumer gets the 'false' return
              // value, and has a chance to attach a 'drain' listener.

              function onwriteDrain(stream, state) {
                if (state.length === 0 && state.needDrain) {
                  state.needDrain = false;
                  stream.emit('drain');
                }
              } // if there's something in the buffer waiting, then process it

              function clearBuffer(stream, state) {
                state.bufferProcessing = true;
                var entry = state.bufferedRequest;

                if (stream._writev && entry && entry.next) {
                  // Fast case, write everything using _writev()
                  var l = state.bufferedRequestCount;
                  var buffer = new Array(l);
                  var holder = state.corkedRequestsFree;
                  holder.entry = entry;
                  var count = 0;
                  var allBuffers = true;

                  while (entry) {
                    buffer[count] = entry;
                    if (!entry.isBuf) allBuffers = false;
                    entry = entry.next;
                    count += 1;
                  }

                  buffer.allBuffers = allBuffers;
                  doWrite(
                    stream,
                    state,
                    true,
                    state.length,
                    buffer,
                    '',
                    holder.finish
                  ); // doWrite is almost always async, defer these to save a bit of time
                  // as the hot path ends with doWrite

                  state.pendingcb++;
                  state.lastBufferedRequest = null;

                  if (holder.next) {
                    state.corkedRequestsFree = holder.next;
                    holder.next = null;
                  } else {
                    state.corkedRequestsFree = new CorkedRequest(state);
                  }

                  state.bufferedRequestCount = 0;
                } else {
                  // Slow case, write chunks one-by-one
                  while (entry) {
                    var chunk = entry.chunk;
                    var encoding = entry.encoding;
                    var cb = entry.callback;
                    var len = state.objectMode ? 1 : chunk.length;
                    doWrite(stream, state, false, len, chunk, encoding, cb);
                    entry = entry.next;
                    state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
                    // it means that we need to wait until it does.
                    // also, that means that the chunk and cb are currently
                    // being processed, so move the buffer counter past them.

                    if (state.writing) {
                      break;
                    }
                  }

                  if (entry === null) state.lastBufferedRequest = null;
                }

                state.bufferedRequest = entry;
                state.bufferProcessing = false;
              }

              Writable.prototype._write = function (chunk, encoding, cb) {
                cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
              };

              Writable.prototype._writev = null;

              Writable.prototype.end = function (chunk, encoding, cb) {
                var state = this._writableState;

                if (typeof chunk === 'function') {
                  cb = chunk;
                  chunk = null;
                  encoding = null;
                } else if (typeof encoding === 'function') {
                  cb = encoding;
                  encoding = null;
                }

                if (chunk !== null && chunk !== undefined)
                  this.write(chunk, encoding); // .end() fully uncorks

                if (state.corked) {
                  state.corked = 1;
                  this.uncork();
                } // ignore unnecessary end() calls.

                if (!state.ending) endWritable(this, state, cb);
                return this;
              };

              Object.defineProperty(Writable.prototype, 'writableLength', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  return this._writableState.length;
                },
              });

              function needFinish(state) {
                return (
                  state.ending &&
                  state.length === 0 &&
                  state.bufferedRequest === null &&
                  !state.finished &&
                  !state.writing
                );
              }

              function callFinal(stream, state) {
                stream._final(function (err) {
                  state.pendingcb--;

                  if (err) {
                    errorOrDestroy(stream, err);
                  }

                  state.prefinished = true;
                  stream.emit('prefinish');
                  finishMaybe(stream, state);
                });
              }

              function prefinish(stream, state) {
                if (!state.prefinished && !state.finalCalled) {
                  if (typeof stream._final === 'function' && !state.destroyed) {
                    state.pendingcb++;
                    state.finalCalled = true;
                    process.nextTick(callFinal, stream, state);
                  } else {
                    state.prefinished = true;
                    stream.emit('prefinish');
                  }
                }
              }

              function finishMaybe(stream, state) {
                var need = needFinish(state);

                if (need) {
                  prefinish(stream, state);

                  if (state.pendingcb === 0) {
                    state.finished = true;
                    stream.emit('finish');

                    if (state.autoDestroy) {
                      // In case of duplex streams we need a way to detect
                      // if the readable side is ready for autoDestroy as well
                      var rState = stream._readableState;

                      if (
                        !rState ||
                        (rState.autoDestroy && rState.endEmitted)
                      ) {
                        stream.destroy();
                      }
                    }
                  }
                }

                return need;
              }

              function endWritable(stream, state, cb) {
                state.ending = true;
                finishMaybe(stream, state);

                if (cb) {
                  if (state.finished) process.nextTick(cb);
                  else stream.once('finish', cb);
                }

                state.ended = true;
                stream.writable = false;
              }

              function onCorkedFinish(corkReq, state, err) {
                var entry = corkReq.entry;
                corkReq.entry = null;

                while (entry) {
                  var cb = entry.callback;
                  state.pendingcb--;
                  cb(err);
                  entry = entry.next;
                } // reuse the free corkReq.

                state.corkedRequestsFree.next = corkReq;
              }

              Object.defineProperty(Writable.prototype, 'destroyed', {
                // making it explicit this property is not enumerable
                // because otherwise some prototype manipulation in
                // userland will fail
                enumerable: false,
                get: function get() {
                  if (this._writableState === undefined) {
                    return false;
                  }

                  return this._writableState.destroyed;
                },
                set: function set(value) {
                  // we ignore the value if the stream
                  // has not been initialized yet
                  if (!this._writableState) {
                    return;
                  } // backward compatibility, the user is explicitly
                  // managing destroyed

                  this._writableState.destroyed = value;
                },
              });
              Writable.prototype.destroy = destroyImpl.destroy;
              Writable.prototype._undestroy = destroyImpl.undestroy;

              Writable.prototype._destroy = function (err, cb) {
                cb(err);
              };
            }.call(this));
          }.call(
            this,
            require('_process'),
            typeof global !== 'undefined'
              ? global
              : typeof self !== 'undefined'
              ? self
              : typeof window !== 'undefined'
              ? window
              : {}
          ));
        },
        {
          '../errors': 16,
          './_stream_duplex': 17,
          './internal/streams/destroy': 24,
          './internal/streams/state': 28,
          './internal/streams/stream': 29,
          _process: 13,
          buffer: 7,
          inherits: 10,
          'util-deprecate': 31,
        },
      ],
      22: [
        function (require, module, exports) {
          (function (process) {
            (function () {
              'use strict';

              var _Object$setPrototypeO;

              function _defineProperty(obj, key, value) {
                if (key in obj) {
                  Object.defineProperty(obj, key, {
                    value: value,
                    enumerable: true,
                    configurable: true,
                    writable: true,
                  });
                } else {
                  obj[key] = value;
                }
                return obj;
              }

              var finished = require('./end-of-stream');

              var kLastResolve = Symbol('lastResolve');
              var kLastReject = Symbol('lastReject');
              var kError = Symbol('error');
              var kEnded = Symbol('ended');
              var kLastPromise = Symbol('lastPromise');
              var kHandlePromise = Symbol('handlePromise');
              var kStream = Symbol('stream');

              function createIterResult(value, done) {
                return {
                  value: value,
                  done: done,
                };
              }

              function readAndResolve(iter) {
                var resolve = iter[kLastResolve];

                if (resolve !== null) {
                  var data = iter[kStream].read(); // we defer if data is null
                  // we can be expecting either 'end' or
                  // 'error'

                  if (data !== null) {
                    iter[kLastPromise] = null;
                    iter[kLastResolve] = null;
                    iter[kLastReject] = null;
                    resolve(createIterResult(data, false));
                  }
                }
              }

              function onReadable(iter) {
                // we wait for the next tick, because it might
                // emit an error with process.nextTick
                process.nextTick(readAndResolve, iter);
              }

              function wrapForNext(lastPromise, iter) {
                return function (resolve, reject) {
                  lastPromise.then(function () {
                    if (iter[kEnded]) {
                      resolve(createIterResult(undefined, true));
                      return;
                    }

                    iter[kHandlePromise](resolve, reject);
                  }, reject);
                };
              }

              var AsyncIteratorPrototype = Object.getPrototypeOf(
                function () {}
              );
              var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf(
                ((_Object$setPrototypeO = {
                  get stream() {
                    return this[kStream];
                  },

                  next: function next() {
                    var _this = this;

                    // if we have detected an error in the meanwhile
                    // reject straight away
                    var error = this[kError];

                    if (error !== null) {
                      return Promise.reject(error);
                    }

                    if (this[kEnded]) {
                      return Promise.resolve(createIterResult(undefined, true));
                    }

                    if (this[kStream].destroyed) {
                      // We need to defer via nextTick because if .destroy(err) is
                      // called, the error will be emitted via nextTick, and
                      // we cannot guarantee that there is no error lingering around
                      // waiting to be emitted.
                      return new Promise(function (resolve, reject) {
                        process.nextTick(function () {
                          if (_this[kError]) {
                            reject(_this[kError]);
                          } else {
                            resolve(createIterResult(undefined, true));
                          }
                        });
                      });
                    } // if we have multiple next() calls
                    // we will wait for the previous Promise to finish
                    // this logic is optimized to support for await loops,
                    // where next() is only called once at a time

                    var lastPromise = this[kLastPromise];
                    var promise;

                    if (lastPromise) {
                      promise = new Promise(wrapForNext(lastPromise, this));
                    } else {
                      // fast path needed to support multiple this.push()
                      // without triggering the next() queue
                      var data = this[kStream].read();

                      if (data !== null) {
                        return Promise.resolve(createIterResult(data, false));
                      }

                      promise = new Promise(this[kHandlePromise]);
                    }

                    this[kLastPromise] = promise;
                    return promise;
                  },
                }),
                _defineProperty(
                  _Object$setPrototypeO,
                  Symbol.asyncIterator,
                  function () {
                    return this;
                  }
                ),
                _defineProperty(
                  _Object$setPrototypeO,
                  'return',
                  function _return() {
                    var _this2 = this;

                    // destroy(err, cb) is a private API
                    // we can guarantee we have that here, because we control the
                    // Readable class this is attached to
                    return new Promise(function (resolve, reject) {
                      _this2[kStream].destroy(null, function (err) {
                        if (err) {
                          reject(err);
                          return;
                        }

                        resolve(createIterResult(undefined, true));
                      });
                    });
                  }
                ),
                _Object$setPrototypeO),
                AsyncIteratorPrototype
              );

              var createReadableStreamAsyncIterator =
                function createReadableStreamAsyncIterator(stream) {
                  var _Object$create;

                  var iterator = Object.create(
                    ReadableStreamAsyncIteratorPrototype,
                    ((_Object$create = {}),
                    _defineProperty(_Object$create, kStream, {
                      value: stream,
                      writable: true,
                    }),
                    _defineProperty(_Object$create, kLastResolve, {
                      value: null,
                      writable: true,
                    }),
                    _defineProperty(_Object$create, kLastReject, {
                      value: null,
                      writable: true,
                    }),
                    _defineProperty(_Object$create, kError, {
                      value: null,
                      writable: true,
                    }),
                    _defineProperty(_Object$create, kEnded, {
                      value: stream._readableState.endEmitted,
                      writable: true,
                    }),
                    _defineProperty(_Object$create, kHandlePromise, {
                      value: function value(resolve, reject) {
                        var data = iterator[kStream].read();

                        if (data) {
                          iterator[kLastPromise] = null;
                          iterator[kLastResolve] = null;
                          iterator[kLastReject] = null;
                          resolve(createIterResult(data, false));
                        } else {
                          iterator[kLastResolve] = resolve;
                          iterator[kLastReject] = reject;
                        }
                      },
                      writable: true,
                    }),
                    _Object$create)
                  );
                  iterator[kLastPromise] = null;
                  finished(stream, function (err) {
                    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
                      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
                      // returned by next() and store the error

                      if (reject !== null) {
                        iterator[kLastPromise] = null;
                        iterator[kLastResolve] = null;
                        iterator[kLastReject] = null;
                        reject(err);
                      }

                      iterator[kError] = err;
                      return;
                    }

                    var resolve = iterator[kLastResolve];

                    if (resolve !== null) {
                      iterator[kLastPromise] = null;
                      iterator[kLastResolve] = null;
                      iterator[kLastReject] = null;
                      resolve(createIterResult(undefined, true));
                    }

                    iterator[kEnded] = true;
                  });
                  stream.on('readable', onReadable.bind(null, iterator));
                  return iterator;
                };

              module.exports = createReadableStreamAsyncIterator;
            }.call(this));
          }.call(this, require('_process')));
        },
        { './end-of-stream': 25, _process: 13 },
      ],
      23: [
        function (require, module, exports) {
          'use strict';

          function ownKeys(object, enumerableOnly) {
            var keys = Object.keys(object);
            if (Object.getOwnPropertySymbols) {
              var symbols = Object.getOwnPropertySymbols(object);
              if (enumerableOnly)
                symbols = symbols.filter(function (sym) {
                  return Object.getOwnPropertyDescriptor(
                    object,
                    sym
                  ).enumerable;
                });
              keys.push.apply(keys, symbols);
            }
            return keys;
          }

          function _objectSpread(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i] != null ? arguments[i] : {};
              if (i % 2) {
                ownKeys(Object(source), true).forEach(function (key) {
                  _defineProperty(target, key, source[key]);
                });
              } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(
                  target,
                  Object.getOwnPropertyDescriptors(source)
                );
              } else {
                ownKeys(Object(source)).forEach(function (key) {
                  Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(source, key)
                  );
                });
              }
            }
            return target;
          }

          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true,
              });
            } else {
              obj[key] = value;
            }
            return obj;
          }

          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError('Cannot call a class as a function');
            }
          }

          function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ('value' in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }

          function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps)
              _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            return Constructor;
          }

          var _require = require('buffer'),
            Buffer = _require.Buffer;

          var _require2 = require('util'),
            inspect = _require2.inspect;

          var custom = (inspect && inspect.custom) || 'inspect';

          function copyBuffer(src, target, offset) {
            Buffer.prototype.copy.call(src, target, offset);
          }

          module.exports =
            /*#__PURE__*/
            (function () {
              function BufferList() {
                _classCallCheck(this, BufferList);

                this.head = null;
                this.tail = null;
                this.length = 0;
              }

              _createClass(BufferList, [
                {
                  key: 'push',
                  value: function push(v) {
                    var entry = {
                      data: v,
                      next: null,
                    };
                    if (this.length > 0) this.tail.next = entry;
                    else this.head = entry;
                    this.tail = entry;
                    ++this.length;
                  },
                },
                {
                  key: 'unshift',
                  value: function unshift(v) {
                    var entry = {
                      data: v,
                      next: this.head,
                    };
                    if (this.length === 0) this.tail = entry;
                    this.head = entry;
                    ++this.length;
                  },
                },
                {
                  key: 'shift',
                  value: function shift() {
                    if (this.length === 0) return;
                    var ret = this.head.data;
                    if (this.length === 1) this.head = this.tail = null;
                    else this.head = this.head.next;
                    --this.length;
                    return ret;
                  },
                },
                {
                  key: 'clear',
                  value: function clear() {
                    this.head = this.tail = null;
                    this.length = 0;
                  },
                },
                {
                  key: 'join',
                  value: function join(s) {
                    if (this.length === 0) return '';
                    var p = this.head;
                    var ret = '' + p.data;

                    while ((p = p.next)) {
                      ret += s + p.data;
                    }

                    return ret;
                  },
                },
                {
                  key: 'concat',
                  value: function concat(n) {
                    if (this.length === 0) return Buffer.alloc(0);
                    var ret = Buffer.allocUnsafe(n >>> 0);
                    var p = this.head;
                    var i = 0;

                    while (p) {
                      copyBuffer(p.data, ret, i);
                      i += p.data.length;
                      p = p.next;
                    }

                    return ret;
                  }, // Consumes a specified amount of bytes or characters from the buffered data.
                },
                {
                  key: 'consume',
                  value: function consume(n, hasStrings) {
                    var ret;

                    if (n < this.head.data.length) {
                      // `slice` is the same for buffers and strings.
                      ret = this.head.data.slice(0, n);
                      this.head.data = this.head.data.slice(n);
                    } else if (n === this.head.data.length) {
                      // First chunk is a perfect match.
                      ret = this.shift();
                    } else {
                      // Result spans more than one buffer.
                      ret = hasStrings
                        ? this._getString(n)
                        : this._getBuffer(n);
                    }

                    return ret;
                  },
                },
                {
                  key: 'first',
                  value: function first() {
                    return this.head.data;
                  }, // Consumes a specified amount of characters from the buffered data.
                },
                {
                  key: '_getString',
                  value: function _getString(n) {
                    var p = this.head;
                    var c = 1;
                    var ret = p.data;
                    n -= ret.length;

                    while ((p = p.next)) {
                      var str = p.data;
                      var nb = n > str.length ? str.length : n;
                      if (nb === str.length) ret += str;
                      else ret += str.slice(0, n);
                      n -= nb;

                      if (n === 0) {
                        if (nb === str.length) {
                          ++c;
                          if (p.next) this.head = p.next;
                          else this.head = this.tail = null;
                        } else {
                          this.head = p;
                          p.data = str.slice(nb);
                        }

                        break;
                      }

                      ++c;
                    }

                    this.length -= c;
                    return ret;
                  }, // Consumes a specified amount of bytes from the buffered data.
                },
                {
                  key: '_getBuffer',
                  value: function _getBuffer(n) {
                    var ret = Buffer.allocUnsafe(n);
                    var p = this.head;
                    var c = 1;
                    p.data.copy(ret);
                    n -= p.data.length;

                    while ((p = p.next)) {
                      var buf = p.data;
                      var nb = n > buf.length ? buf.length : n;
                      buf.copy(ret, ret.length - n, 0, nb);
                      n -= nb;

                      if (n === 0) {
                        if (nb === buf.length) {
                          ++c;
                          if (p.next) this.head = p.next;
                          else this.head = this.tail = null;
                        } else {
                          this.head = p;
                          p.data = buf.slice(nb);
                        }

                        break;
                      }

                      ++c;
                    }

                    this.length -= c;
                    return ret;
                  }, // Make sure the linked list only shows the minimal necessary information.
                },
                {
                  key: custom,
                  value: function value(_, options) {
                    return inspect(
                      this,
                      _objectSpread({}, options, {
                        // Only inspect one level.
                        depth: 0,
                        // It should not recurse.
                        customInspect: false,
                      })
                    );
                  },
                },
              ]);

              return BufferList;
            })();
        },
        { buffer: 7, util: 6 },
      ],
      24: [
        function (require, module, exports) {
          (function (process) {
            (function () {
              'use strict'; // undocumented cb() API, needed for core, not for public API

              function destroy(err, cb) {
                var _this = this;

                var readableDestroyed =
                  this._readableState && this._readableState.destroyed;
                var writableDestroyed =
                  this._writableState && this._writableState.destroyed;

                if (readableDestroyed || writableDestroyed) {
                  if (cb) {
                    cb(err);
                  } else if (err) {
                    if (!this._writableState) {
                      process.nextTick(emitErrorNT, this, err);
                    } else if (!this._writableState.errorEmitted) {
                      this._writableState.errorEmitted = true;
                      process.nextTick(emitErrorNT, this, err);
                    }
                  }

                  return this;
                } // we set destroyed to true before firing error callbacks in order
                // to make it re-entrance safe in case destroy() is called within callbacks

                if (this._readableState) {
                  this._readableState.destroyed = true;
                } // if this is a duplex stream mark the writable part as destroyed as well

                if (this._writableState) {
                  this._writableState.destroyed = true;
                }

                this._destroy(err || null, function (err) {
                  if (!cb && err) {
                    if (!_this._writableState) {
                      process.nextTick(emitErrorAndCloseNT, _this, err);
                    } else if (!_this._writableState.errorEmitted) {
                      _this._writableState.errorEmitted = true;
                      process.nextTick(emitErrorAndCloseNT, _this, err);
                    } else {
                      process.nextTick(emitCloseNT, _this);
                    }
                  } else if (cb) {
                    process.nextTick(emitCloseNT, _this);
                    cb(err);
                  } else {
                    process.nextTick(emitCloseNT, _this);
                  }
                });

                return this;
              }

              function emitErrorAndCloseNT(self, err) {
                emitErrorNT(self, err);
                emitCloseNT(self);
              }

              function emitCloseNT(self) {
                if (self._writableState && !self._writableState.emitClose)
                  return;
                if (self._readableState && !self._readableState.emitClose)
                  return;
                self.emit('close');
              }

              function undestroy() {
                if (this._readableState) {
                  this._readableState.destroyed = false;
                  this._readableState.reading = false;
                  this._readableState.ended = false;
                  this._readableState.endEmitted = false;
                }

                if (this._writableState) {
                  this._writableState.destroyed = false;
                  this._writableState.ended = false;
                  this._writableState.ending = false;
                  this._writableState.finalCalled = false;
                  this._writableState.prefinished = false;
                  this._writableState.finished = false;
                  this._writableState.errorEmitted = false;
                }
              }

              function emitErrorNT(self, err) {
                self.emit('error', err);
              }

              function errorOrDestroy(stream, err) {
                // We have tests that rely on errors being emitted
                // in the same tick, so changing this is semver major.
                // For now when you opt-in to autoDestroy we allow
                // the error to be emitted nextTick. In a future
                // semver major update we should change the default to this.
                var rState = stream._readableState;
                var wState = stream._writableState;
                if (
                  (rState && rState.autoDestroy) ||
                  (wState && wState.autoDestroy)
                )
                  stream.destroy(err);
                else stream.emit('error', err);
              }

              module.exports = {
                destroy: destroy,
                undestroy: undestroy,
                errorOrDestroy: errorOrDestroy,
              };
            }.call(this));
          }.call(this, require('_process')));
        },
        { _process: 13 },
      ],
      25: [
        function (require, module, exports) {
          // Ported from https://github.com/mafintosh/end-of-stream with
          // permission from the author, Mathias Buus (@mafintosh).
          'use strict';

          var ERR_STREAM_PREMATURE_CLOSE =
            require('../../../errors').codes.ERR_STREAM_PREMATURE_CLOSE;

          function once(callback) {
            var called = false;
            return function () {
              if (called) return;
              called = true;

              for (
                var _len = arguments.length, args = new Array(_len), _key = 0;
                _key < _len;
                _key++
              ) {
                args[_key] = arguments[_key];
              }

              callback.apply(this, args);
            };
          }

          function noop() {}

          function isRequest(stream) {
            return stream.setHeader && typeof stream.abort === 'function';
          }

          function eos(stream, opts, callback) {
            if (typeof opts === 'function') return eos(stream, null, opts);
            if (!opts) opts = {};
            callback = once(callback || noop);
            var readable =
              opts.readable || (opts.readable !== false && stream.readable);
            var writable =
              opts.writable || (opts.writable !== false && stream.writable);

            var onlegacyfinish = function onlegacyfinish() {
              if (!stream.writable) onfinish();
            };

            var writableEnded =
              stream._writableState && stream._writableState.finished;

            var onfinish = function onfinish() {
              writable = false;
              writableEnded = true;
              if (!readable) callback.call(stream);
            };

            var readableEnded =
              stream._readableState && stream._readableState.endEmitted;

            var onend = function onend() {
              readable = false;
              readableEnded = true;
              if (!writable) callback.call(stream);
            };

            var onerror = function onerror(err) {
              callback.call(stream, err);
            };

            var onclose = function onclose() {
              var err;

              if (readable && !readableEnded) {
                if (!stream._readableState || !stream._readableState.ended)
                  err = new ERR_STREAM_PREMATURE_CLOSE();
                return callback.call(stream, err);
              }

              if (writable && !writableEnded) {
                if (!stream._writableState || !stream._writableState.ended)
                  err = new ERR_STREAM_PREMATURE_CLOSE();
                return callback.call(stream, err);
              }
            };

            var onrequest = function onrequest() {
              stream.req.on('finish', onfinish);
            };

            if (isRequest(stream)) {
              stream.on('complete', onfinish);
              stream.on('abort', onclose);
              if (stream.req) onrequest();
              else stream.on('request', onrequest);
            } else if (writable && !stream._writableState) {
              // legacy streams
              stream.on('end', onlegacyfinish);
              stream.on('close', onlegacyfinish);
            }

            stream.on('end', onend);
            stream.on('finish', onfinish);
            if (opts.error !== false) stream.on('error', onerror);
            stream.on('close', onclose);
            return function () {
              stream.removeListener('complete', onfinish);
              stream.removeListener('abort', onclose);
              stream.removeListener('request', onrequest);
              if (stream.req) stream.req.removeListener('finish', onfinish);
              stream.removeListener('end', onlegacyfinish);
              stream.removeListener('close', onlegacyfinish);
              stream.removeListener('finish', onfinish);
              stream.removeListener('end', onend);
              stream.removeListener('error', onerror);
              stream.removeListener('close', onclose);
            };
          }

          module.exports = eos;
        },
        { '../../../errors': 16 },
      ],
      26: [
        function (require, module, exports) {
          module.exports = function () {
            throw new Error('Readable.from is not available in the browser');
          };
        },
        {},
      ],
      27: [
        function (require, module, exports) {
          // Ported from https://github.com/mafintosh/pump with
          // permission from the author, Mathias Buus (@mafintosh).
          'use strict';

          var eos;

          function once(callback) {
            var called = false;
            return function () {
              if (called) return;
              called = true;
              callback.apply(void 0, arguments);
            };
          }

          var _require$codes = require('../../../errors').codes,
            ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS,
            ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;

          function noop(err) {
            // Rethrow the error if it exists to avoid swallowing it
            if (err) throw err;
          }

          function isRequest(stream) {
            return stream.setHeader && typeof stream.abort === 'function';
          }

          function destroyer(stream, reading, writing, callback) {
            callback = once(callback);
            var closed = false;
            stream.on('close', function () {
              closed = true;
            });
            if (eos === undefined) eos = require('./end-of-stream');
            eos(
              stream,
              {
                readable: reading,
                writable: writing,
              },
              function (err) {
                if (err) return callback(err);
                closed = true;
                callback();
              }
            );
            var destroyed = false;
            return function (err) {
              if (closed) return;
              if (destroyed) return;
              destroyed = true; // request.destroy just do .end - .abort is what we want

              if (isRequest(stream)) return stream.abort();
              if (typeof stream.destroy === 'function') return stream.destroy();
              callback(err || new ERR_STREAM_DESTROYED('pipe'));
            };
          }

          function call(fn) {
            fn();
          }

          function pipe(from, to) {
            return from.pipe(to);
          }

          function popCallback(streams) {
            if (!streams.length) return noop;
            if (typeof streams[streams.length - 1] !== 'function') return noop;
            return streams.pop();
          }

          function pipeline() {
            for (
              var _len = arguments.length, streams = new Array(_len), _key = 0;
              _key < _len;
              _key++
            ) {
              streams[_key] = arguments[_key];
            }

            var callback = popCallback(streams);
            if (Array.isArray(streams[0])) streams = streams[0];

            if (streams.length < 2) {
              throw new ERR_MISSING_ARGS('streams');
            }

            var error;
            var destroys = streams.map(function (stream, i) {
              var reading = i < streams.length - 1;
              var writing = i > 0;
              return destroyer(stream, reading, writing, function (err) {
                if (!error) error = err;
                if (err) destroys.forEach(call);
                if (reading) return;
                destroys.forEach(call);
                callback(error);
              });
            });
            return streams.reduce(pipe);
          }

          module.exports = pipeline;
        },
        { '../../../errors': 16, './end-of-stream': 25 },
      ],
      28: [
        function (require, module, exports) {
          'use strict';

          var ERR_INVALID_OPT_VALUE =
            require('../../../errors').codes.ERR_INVALID_OPT_VALUE;

          function highWaterMarkFrom(options, isDuplex, duplexKey) {
            return options.highWaterMark != null
              ? options.highWaterMark
              : isDuplex
              ? options[duplexKey]
              : null;
          }

          function getHighWaterMark(state, options, duplexKey, isDuplex) {
            var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

            if (hwm != null) {
              if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
                var name = isDuplex ? duplexKey : 'highWaterMark';
                throw new ERR_INVALID_OPT_VALUE(name, hwm);
              }

              return Math.floor(hwm);
            } // Default value

            return state.objectMode ? 16 : 16 * 1024;
          }

          module.exports = {
            getHighWaterMark: getHighWaterMark,
          };
        },
        { '../../../errors': 16 },
      ],
      29: [
        function (require, module, exports) {
          module.exports = require('events').EventEmitter;
        },
        { events: 8 },
      ],
      30: [
        function (require, module, exports) {
          // Copyright Joyent, Inc. and other Node contributors.
          //
          // Permission is hereby granted, free of charge, to any person obtaining a
          // copy of this software and associated documentation files (the
          // "Software"), to deal in the Software without restriction, including
          // without limitation the rights to use, copy, modify, merge, publish,
          // distribute, sublicense, and/or sell copies of the Software, and to permit
          // persons to whom the Software is furnished to do so, subject to the
          // following conditions:
          //
          // The above copyright notice and this permission notice shall be included
          // in all copies or substantial portions of the Software.
          //
          // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
          // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
          // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
          // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
          // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
          // USE OR OTHER DEALINGS IN THE SOFTWARE.

          'use strict';

          /*<replacement>*/

          var Buffer = require('safe-buffer').Buffer;
          /*</replacement>*/

          var isEncoding =
            Buffer.isEncoding ||
            function (encoding) {
              encoding = '' + encoding;
              switch (encoding && encoding.toLowerCase()) {
                case 'hex':
                case 'utf8':
                case 'utf-8':
                case 'ascii':
                case 'binary':
                case 'base64':
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                case 'raw':
                  return true;
                default:
                  return false;
              }
            };

          function _normalizeEncoding(enc) {
            if (!enc) return 'utf8';
            var retried;
            while (true) {
              switch (enc) {
                case 'utf8':
                case 'utf-8':
                  return 'utf8';
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return 'utf16le';
                case 'latin1':
                case 'binary':
                  return 'latin1';
                case 'base64':
                case 'ascii':
                case 'hex':
                  return enc;
                default: // undefined
                  if (retried) return;
                  enc = ('' + enc).toLowerCase();
                  retried = true;
              }
            }
          }

          // Do not cache `Buffer.isEncoding` when checking encoding names as some
          // modules monkey-patch it to support additional encodings
          function normalizeEncoding(enc) {
            var nenc = _normalizeEncoding(enc);
            if (
              typeof nenc !== 'string' &&
              (Buffer.isEncoding === isEncoding || !isEncoding(enc))
            )
              throw new Error('Unknown encoding: ' + enc);
            return nenc || enc;
          }

          // StringDecoder provides an interface for efficiently splitting a series of
          // buffers into a series of JS strings without breaking apart multi-byte
          // characters.
          exports.StringDecoder = StringDecoder;
          function StringDecoder(encoding) {
            this.encoding = normalizeEncoding(encoding);
            var nb;
            switch (this.encoding) {
              case 'utf16le':
                this.text = utf16Text;
                this.end = utf16End;
                nb = 4;
                break;
              case 'utf8':
                this.fillLast = utf8FillLast;
                nb = 4;
                break;
              case 'base64':
                this.text = base64Text;
                this.end = base64End;
                nb = 3;
                break;
              default:
                this.write = simpleWrite;
                this.end = simpleEnd;
                return;
            }
            this.lastNeed = 0;
            this.lastTotal = 0;
            this.lastChar = Buffer.allocUnsafe(nb);
          }

          StringDecoder.prototype.write = function (buf) {
            if (buf.length === 0) return '';
            var r;
            var i;
            if (this.lastNeed) {
              r = this.fillLast(buf);
              if (r === undefined) return '';
              i = this.lastNeed;
              this.lastNeed = 0;
            } else {
              i = 0;
            }
            if (i < buf.length)
              return r ? r + this.text(buf, i) : this.text(buf, i);
            return r || '';
          };

          StringDecoder.prototype.end = utf8End;

          // Returns only complete characters in a Buffer
          StringDecoder.prototype.text = utf8Text;

          // Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
          StringDecoder.prototype.fillLast = function (buf) {
            if (this.lastNeed <= buf.length) {
              buf.copy(
                this.lastChar,
                this.lastTotal - this.lastNeed,
                0,
                this.lastNeed
              );
              return this.lastChar.toString(this.encoding, 0, this.lastTotal);
            }
            buf.copy(
              this.lastChar,
              this.lastTotal - this.lastNeed,
              0,
              buf.length
            );
            this.lastNeed -= buf.length;
          };

          // Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
          // continuation byte. If an invalid byte is detected, -2 is returned.
          function utf8CheckByte(byte) {
            if (byte <= 0x7f) return 0;
            else if (byte >> 5 === 0x06) return 2;
            else if (byte >> 4 === 0x0e) return 3;
            else if (byte >> 3 === 0x1e) return 4;
            return byte >> 6 === 0x02 ? -1 : -2;
          }

          // Checks at most 3 bytes at the end of a Buffer in order to detect an
          // incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
          // needed to complete the UTF-8 character (if applicable) are returned.
          function utf8CheckIncomplete(self, buf, i) {
            var j = buf.length - 1;
            if (j < i) return 0;
            var nb = utf8CheckByte(buf[j]);
            if (nb >= 0) {
              if (nb > 0) self.lastNeed = nb - 1;
              return nb;
            }
            if (--j < i || nb === -2) return 0;
            nb = utf8CheckByte(buf[j]);
            if (nb >= 0) {
              if (nb > 0) self.lastNeed = nb - 2;
              return nb;
            }
            if (--j < i || nb === -2) return 0;
            nb = utf8CheckByte(buf[j]);
            if (nb >= 0) {
              if (nb > 0) {
                if (nb === 2) nb = 0;
                else self.lastNeed = nb - 3;
              }
              return nb;
            }
            return 0;
          }

          // Validates as many continuation bytes for a multi-byte UTF-8 character as
          // needed or are available. If we see a non-continuation byte where we expect
          // one, we "replace" the validated continuation bytes we've seen so far with
          // a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
          // behavior. The continuation byte check is included three times in the case
          // where all of the continuation bytes for a character exist in the same buffer.
          // It is also done this way as a slight performance increase instead of using a
          // loop.
          function utf8CheckExtraBytes(self, buf, p) {
            if ((buf[0] & 0xc0) !== 0x80) {
              self.lastNeed = 0;
              return '\ufffd';
            }
            if (self.lastNeed > 1 && buf.length > 1) {
              if ((buf[1] & 0xc0) !== 0x80) {
                self.lastNeed = 1;
                return '\ufffd';
              }
              if (self.lastNeed > 2 && buf.length > 2) {
                if ((buf[2] & 0xc0) !== 0x80) {
                  self.lastNeed = 2;
                  return '\ufffd';
                }
              }
            }
          }

          // Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
          function utf8FillLast(buf) {
            var p = this.lastTotal - this.lastNeed;
            var r = utf8CheckExtraBytes(this, buf, p);
            if (r !== undefined) return r;
            if (this.lastNeed <= buf.length) {
              buf.copy(this.lastChar, p, 0, this.lastNeed);
              return this.lastChar.toString(this.encoding, 0, this.lastTotal);
            }
            buf.copy(this.lastChar, p, 0, buf.length);
            this.lastNeed -= buf.length;
          }

          // Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
          // partial character, the character's bytes are buffered until the required
          // number of bytes are available.
          function utf8Text(buf, i) {
            var total = utf8CheckIncomplete(this, buf, i);
            if (!this.lastNeed) return buf.toString('utf8', i);
            this.lastTotal = total;
            var end = buf.length - (total - this.lastNeed);
            buf.copy(this.lastChar, 0, end);
            return buf.toString('utf8', i, end);
          }

          // For UTF-8, a replacement character is added when ending on a partial
          // character.
          function utf8End(buf) {
            var r = buf && buf.length ? this.write(buf) : '';
            if (this.lastNeed) return r + '\ufffd';
            return r;
          }

          // UTF-16LE typically needs two bytes per character, but even if we have an even
          // number of bytes available, we need to check if we end on a leading/high
          // surrogate. In that case, we need to wait for the next two bytes in order to
          // decode the last character properly.
          function utf16Text(buf, i) {
            if ((buf.length - i) % 2 === 0) {
              var r = buf.toString('utf16le', i);
              if (r) {
                var c = r.charCodeAt(r.length - 1);
                if (c >= 0xd800 && c <= 0xdbff) {
                  this.lastNeed = 2;
                  this.lastTotal = 4;
                  this.lastChar[0] = buf[buf.length - 2];
                  this.lastChar[1] = buf[buf.length - 1];
                  return r.slice(0, -1);
                }
              }
              return r;
            }
            this.lastNeed = 1;
            this.lastTotal = 2;
            this.lastChar[0] = buf[buf.length - 1];
            return buf.toString('utf16le', i, buf.length - 1);
          }

          // For UTF-16LE we do not explicitly append special replacement characters if we
          // end on a partial character, we simply let v8 handle that.
          function utf16End(buf) {
            var r = buf && buf.length ? this.write(buf) : '';
            if (this.lastNeed) {
              var end = this.lastTotal - this.lastNeed;
              return r + this.lastChar.toString('utf16le', 0, end);
            }
            return r;
          }

          function base64Text(buf, i) {
            var n = (buf.length - i) % 3;
            if (n === 0) return buf.toString('base64', i);
            this.lastNeed = 3 - n;
            this.lastTotal = 3;
            if (n === 1) {
              this.lastChar[0] = buf[buf.length - 1];
            } else {
              this.lastChar[0] = buf[buf.length - 2];
              this.lastChar[1] = buf[buf.length - 1];
            }
            return buf.toString('base64', i, buf.length - n);
          }

          function base64End(buf) {
            var r = buf && buf.length ? this.write(buf) : '';
            if (this.lastNeed)
              return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
            return r;
          }

          // Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
          function simpleWrite(buf) {
            return buf.toString(this.encoding);
          }

          function simpleEnd(buf) {
            return buf && buf.length ? this.write(buf) : '';
          }
        },
        { 'safe-buffer': 14 },
      ],
      31: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              /**
               * Module exports.
               */

              module.exports = deprecate;

              /**
               * Mark that a method should not be used.
               * Returns a modified function which warns once by default.
               *
               * If `localStorage.noDeprecation = true` is set, then it is a no-op.
               *
               * If `localStorage.throwDeprecation = true` is set, then deprecated functions
               * will throw an Error when invoked.
               *
               * If `localStorage.traceDeprecation = true` is set, then deprecated functions
               * will invoke `console.trace()` instead of `console.error()`.
               *
               * @param {Function} fn - the function to deprecate
               * @param {String} msg - the string to print to the console when `fn` is invoked
               * @returns {Function} a new "deprecated" version of `fn`
               * @api public
               */

              function deprecate(fn, msg) {
                if (config('noDeprecation')) {
                  return fn;
                }

                var warned = false;
                function deprecated() {
                  if (!warned) {
                    if (config('throwDeprecation')) {
                      throw new Error(msg);
                    } else if (config('traceDeprecation')) {
                      console.trace(msg);
                    } else {
                      console.warn(msg);
                    }
                    warned = true;
                  }
                  return fn.apply(this, arguments);
                }

                return deprecated;
              }

              /**
               * Checks `localStorage` for boolean values for the given `name`.
               *
               * @param {String} name
               * @returns {Boolean}
               * @api private
               */

              function config(name) {
                // accessing global.localStorage can trigger a DOMException in sandboxed iframes
                try {
                  if (!global.localStorage) return false;
                } catch (_) {
                  return false;
                }
                var val = global.localStorage[name];
                if (null == val) return false;
                return String(val).toLowerCase() === 'true';
              }
            }.call(this));
          }.call(
            this,
            typeof global !== 'undefined'
              ? global
              : typeof self !== 'undefined'
              ? self
              : typeof window !== 'undefined'
              ? window
              : {}
          ));
        },
        {},
      ],
      32: [
        function (require, module, exports) {
          'use strict';
          // base-x encoding / decoding
          // Copyright (c) 2018 base-x contributors
          // Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
          // Distributed under the MIT software license, see the accompanying
          // file LICENSE or http://www.opensource.org/licenses/mit-license.php.
          // @ts-ignore
          var _Buffer = require('safe-buffer').Buffer;
          function base(ALPHABET) {
            if (ALPHABET.length >= 255) {
              throw new TypeError('Alphabet too long');
            }
            var BASE_MAP = new Uint8Array(256);
            for (var j = 0; j < BASE_MAP.length; j++) {
              BASE_MAP[j] = 255;
            }
            for (var i = 0; i < ALPHABET.length; i++) {
              var x = ALPHABET.charAt(i);
              var xc = x.charCodeAt(0);
              if (BASE_MAP[xc] !== 255) {
                throw new TypeError(x + ' is ambiguous');
              }
              BASE_MAP[xc] = i;
            }
            var BASE = ALPHABET.length;
            var LEADER = ALPHABET.charAt(0);
            var FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
            var iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up
            function encode(source) {
              if (Array.isArray(source) || source instanceof Uint8Array) {
                source = _Buffer.from(source);
              }
              if (!_Buffer.isBuffer(source)) {
                throw new TypeError('Expected Buffer');
              }
              if (source.length === 0) {
                return '';
              }
              // Skip & count leading zeroes.
              var zeroes = 0;
              var length = 0;
              var pbegin = 0;
              var pend = source.length;
              while (pbegin !== pend && source[pbegin] === 0) {
                pbegin++;
                zeroes++;
              }
              // Allocate enough space in big-endian base58 representation.
              var size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
              var b58 = new Uint8Array(size);
              // Process the bytes.
              while (pbegin !== pend) {
                var carry = source[pbegin];
                // Apply "b58 = b58 * 256 + ch".
                var i = 0;
                for (
                  var it1 = size - 1;
                  (carry !== 0 || i < length) && it1 !== -1;
                  it1--, i++
                ) {
                  carry += (256 * b58[it1]) >>> 0;
                  b58[it1] = carry % BASE >>> 0;
                  carry = (carry / BASE) >>> 0;
                }
                if (carry !== 0) {
                  throw new Error('Non-zero carry');
                }
                length = i;
                pbegin++;
              }
              // Skip leading zeroes in base58 result.
              var it2 = size - length;
              while (it2 !== size && b58[it2] === 0) {
                it2++;
              }
              // Translate the result into a string.
              var str = LEADER.repeat(zeroes);
              for (; it2 < size; ++it2) {
                str += ALPHABET.charAt(b58[it2]);
              }
              return str;
            }
            function decodeUnsafe(source) {
              if (typeof source !== 'string') {
                throw new TypeError('Expected String');
              }
              if (source.length === 0) {
                return _Buffer.alloc(0);
              }
              var psz = 0;
              // Skip and count leading '1's.
              var zeroes = 0;
              var length = 0;
              while (source[psz] === LEADER) {
                zeroes++;
                psz++;
              }
              // Allocate enough space in big-endian base256 representation.
              var size = ((source.length - psz) * FACTOR + 1) >>> 0; // log(58) / log(256), rounded up.
              var b256 = new Uint8Array(size);
              // Process the characters.
              while (source[psz]) {
                // Decode character
                var carry = BASE_MAP[source.charCodeAt(psz)];
                // Invalid character
                if (carry === 255) {
                  return;
                }
                var i = 0;
                for (
                  var it3 = size - 1;
                  (carry !== 0 || i < length) && it3 !== -1;
                  it3--, i++
                ) {
                  carry += (BASE * b256[it3]) >>> 0;
                  b256[it3] = carry % 256 >>> 0;
                  carry = (carry / 256) >>> 0;
                }
                if (carry !== 0) {
                  throw new Error('Non-zero carry');
                }
                length = i;
                psz++;
              }
              // Skip leading zeroes in b256.
              var it4 = size - length;
              while (it4 !== size && b256[it4] === 0) {
                it4++;
              }
              var vch = _Buffer.allocUnsafe(zeroes + (size - it4));
              vch.fill(0x00, 0, zeroes);
              var j = zeroes;
              while (it4 !== size) {
                vch[j++] = b256[it4++];
              }
              return vch;
            }
            function decode(string) {
              var buffer = decodeUnsafe(string);
              if (buffer) {
                return buffer;
              }
              throw new Error('Non-base' + BASE + ' character');
            }
            return {
              encode: encode,
              decodeUnsafe: decodeUnsafe,
              decode: decode,
            };
          }
          module.exports = base;
        },
        { 'safe-buffer': 76 },
      ],
      33: [
        function (require, module, exports) {
          'use strict';
          var ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

          // pre-compute lookup table
          var ALPHABET_MAP = {};
          for (var z = 0; z < ALPHABET.length; z++) {
            var x = ALPHABET.charAt(z);

            if (ALPHABET_MAP[x] !== undefined)
              throw new TypeError(x + ' is ambiguous');
            ALPHABET_MAP[x] = z;
          }

          function polymodStep(pre) {
            var b = pre >> 25;
            return (
              ((pre & 0x1ffffff) << 5) ^
              (-((b >> 0) & 1) & 0x3b6a57b2) ^
              (-((b >> 1) & 1) & 0x26508e6d) ^
              (-((b >> 2) & 1) & 0x1ea119fa) ^
              (-((b >> 3) & 1) & 0x3d4233dd) ^
              (-((b >> 4) & 1) & 0x2a1462b3)
            );
          }

          function prefixChk(prefix) {
            var chk = 1;
            for (var i = 0; i < prefix.length; ++i) {
              var c = prefix.charCodeAt(i);
              if (c < 33 || c > 126) return 'Invalid prefix (' + prefix + ')';

              chk = polymodStep(chk) ^ (c >> 5);
            }
            chk = polymodStep(chk);

            for (i = 0; i < prefix.length; ++i) {
              var v = prefix.charCodeAt(i);
              chk = polymodStep(chk) ^ (v & 0x1f);
            }
            return chk;
          }

          function encode(prefix, words, LIMIT) {
            LIMIT = LIMIT || 90;
            if (prefix.length + 7 + words.length > LIMIT)
              throw new TypeError('Exceeds length limit');

            prefix = prefix.toLowerCase();

            // determine chk mod
            var chk = prefixChk(prefix);
            if (typeof chk === 'string') throw new Error(chk);

            var result = prefix + '1';
            for (var i = 0; i < words.length; ++i) {
              var x = words[i];
              if (x >> 5 !== 0) throw new Error('Non 5-bit word');

              chk = polymodStep(chk) ^ x;
              result += ALPHABET.charAt(x);
            }

            for (i = 0; i < 6; ++i) {
              chk = polymodStep(chk);
            }
            chk ^= 1;

            for (i = 0; i < 6; ++i) {
              var v = (chk >> ((5 - i) * 5)) & 0x1f;
              result += ALPHABET.charAt(v);
            }

            return result;
          }

          function __decode(str, LIMIT) {
            LIMIT = LIMIT || 90;
            if (str.length < 8) return str + ' too short';
            if (str.length > LIMIT) return 'Exceeds length limit';

            // don't allow mixed case
            var lowered = str.toLowerCase();
            var uppered = str.toUpperCase();
            if (str !== lowered && str !== uppered)
              return 'Mixed-case string ' + str;
            str = lowered;

            var split = str.lastIndexOf('1');
            if (split === -1) return 'No separator character for ' + str;
            if (split === 0) return 'Missing prefix for ' + str;

            var prefix = str.slice(0, split);
            var wordChars = str.slice(split + 1);
            if (wordChars.length < 6) return 'Data too short';

            var chk = prefixChk(prefix);
            if (typeof chk === 'string') return chk;

            var words = [];
            for (var i = 0; i < wordChars.length; ++i) {
              var c = wordChars.charAt(i);
              var v = ALPHABET_MAP[c];
              if (v === undefined) return 'Unknown character ' + c;
              chk = polymodStep(chk) ^ v;

              // not in the checksum?
              if (i + 6 >= wordChars.length) continue;
              words.push(v);
            }

            if (chk !== 1) return 'Invalid checksum for ' + str;
            return { prefix: prefix, words: words };
          }

          function decodeUnsafe() {
            var res = __decode.apply(null, arguments);
            if (typeof res === 'object') return res;
          }

          function decode(str) {
            var res = __decode.apply(null, arguments);
            if (typeof res === 'object') return res;

            throw new Error(res);
          }

          function convert(data, inBits, outBits, pad) {
            var value = 0;
            var bits = 0;
            var maxV = (1 << outBits) - 1;

            var result = [];
            for (var i = 0; i < data.length; ++i) {
              value = (value << inBits) | data[i];
              bits += inBits;

              while (bits >= outBits) {
                bits -= outBits;
                result.push((value >> bits) & maxV);
              }
            }

            if (pad) {
              if (bits > 0) {
                result.push((value << (outBits - bits)) & maxV);
              }
            } else {
              if (bits >= inBits) return 'Excess padding';
              if ((value << (outBits - bits)) & maxV) return 'Non-zero padding';
            }

            return result;
          }

          function toWordsUnsafe(bytes) {
            var res = convert(bytes, 8, 5, true);
            if (Array.isArray(res)) return res;
          }

          function toWords(bytes) {
            var res = convert(bytes, 8, 5, true);
            if (Array.isArray(res)) return res;

            throw new Error(res);
          }

          function fromWordsUnsafe(words) {
            var res = convert(words, 5, 8, false);
            if (Array.isArray(res)) return res;
          }

          function fromWords(words) {
            var res = convert(words, 5, 8, false);
            if (Array.isArray(res)) return res;

            throw new Error(res);
          }

          module.exports = {
            decodeUnsafe: decodeUnsafe,
            decode: decode,
            encode: encode,
            toWordsUnsafe: toWordsUnsafe,
            toWords: toWords,
            fromWordsUnsafe: fromWordsUnsafe,
            fromWords: fromWords,
          };
        },
        {},
      ],
      34: [
        function (require, module, exports) {
          // (public) Constructor
          function BigInteger(a, b, c) {
            if (!(this instanceof BigInteger)) return new BigInteger(a, b, c);

            if (a != null) {
              if ('number' == typeof a) this.fromNumber(a, b, c);
              else if (b == null && 'string' != typeof a)
                this.fromString(a, 256);
              else this.fromString(a, b);
            }
          }

          var proto = BigInteger.prototype;

          // duck-typed isBigInteger
          proto.__bigi = require('../package.json').version;
          BigInteger.isBigInteger = function (obj, check_ver) {
            return (
              obj && obj.__bigi && (!check_ver || obj.__bigi === proto.__bigi)
            );
          };

          // Bits per digit
          var dbits;

          // am: Compute w_j += (x*this_i), propagate carries,
          // c is initial carry, returns final carry.
          // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
          // We need to select the fastest one that works in this environment.

          // am1: use a single mult and divide to get the high bits,
          // max digit bits should be 26 because
          // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
          function am1(i, x, w, j, c, n) {
            while (--n >= 0) {
              var v = x * this[i++] + w[j] + c;
              c = Math.floor(v / 0x4000000);
              w[j++] = v & 0x3ffffff;
            }
            return c;
          }
          // am2 avoids a big mult-and-extract completely.
          // Max digit bits should be <= 30 because we do bitwise ops
          // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
          function am2(i, x, w, j, c, n) {
            var xl = x & 0x7fff,
              xh = x >> 15;
            while (--n >= 0) {
              var l = this[i] & 0x7fff;
              var h = this[i++] >> 15;
              var m = xh * l + h * xl;
              l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
              c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
              w[j++] = l & 0x3fffffff;
            }
            return c;
          }
          // Alternately, set max digit bits to 28 since some
          // browsers slow down when dealing with 32-bit numbers.
          function am3(i, x, w, j, c, n) {
            var xl = x & 0x3fff,
              xh = x >> 14;
            while (--n >= 0) {
              var l = this[i] & 0x3fff;
              var h = this[i++] >> 14;
              var m = xh * l + h * xl;
              l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
              c = (l >> 28) + (m >> 14) + xh * h;
              w[j++] = l & 0xfffffff;
            }
            return c;
          }

          // wtf?
          BigInteger.prototype.am = am1;
          dbits = 26;

          BigInteger.prototype.DB = dbits;
          BigInteger.prototype.DM = (1 << dbits) - 1;
          var DV = (BigInteger.prototype.DV = 1 << dbits);

          var BI_FP = 52;
          BigInteger.prototype.FV = Math.pow(2, BI_FP);
          BigInteger.prototype.F1 = BI_FP - dbits;
          BigInteger.prototype.F2 = 2 * dbits - BI_FP;

          // Digit conversions
          var BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz';
          var BI_RC = new Array();
          var rr, vv;
          rr = '0'.charCodeAt(0);
          for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
          rr = 'a'.charCodeAt(0);
          for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
          rr = 'A'.charCodeAt(0);
          for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

          function int2char(n) {
            return BI_RM.charAt(n);
          }

          function intAt(s, i) {
            var c = BI_RC[s.charCodeAt(i)];
            return c == null ? -1 : c;
          }

          // (protected) copy this to r
          function bnpCopyTo(r) {
            for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
            r.t = this.t;
            r.s = this.s;
          }

          // (protected) set from integer value x, -DV <= x < DV
          function bnpFromInt(x) {
            this.t = 1;
            this.s = x < 0 ? -1 : 0;
            if (x > 0) this[0] = x;
            else if (x < -1) this[0] = x + DV;
            else this.t = 0;
          }

          // return bigint initialized to value
          function nbv(i) {
            var r = new BigInteger();
            r.fromInt(i);
            return r;
          }

          // (protected) set from string and radix
          function bnpFromString(s, b) {
            var self = this;

            var k;
            if (b == 16) k = 4;
            else if (b == 8) k = 3;
            else if (b == 256) k = 8; // byte array
            else if (b == 2) k = 1;
            else if (b == 32) k = 5;
            else if (b == 4) k = 2;
            else {
              self.fromRadix(s, b);
              return;
            }
            self.t = 0;
            self.s = 0;
            var i = s.length,
              mi = false,
              sh = 0;
            while (--i >= 0) {
              var x = k == 8 ? s[i] & 0xff : intAt(s, i);
              if (x < 0) {
                if (s.charAt(i) == '-') mi = true;
                continue;
              }
              mi = false;
              if (sh == 0) self[self.t++] = x;
              else if (sh + k > self.DB) {
                self[self.t - 1] |= (x & ((1 << (self.DB - sh)) - 1)) << sh;
                self[self.t++] = x >> (self.DB - sh);
              } else self[self.t - 1] |= x << sh;
              sh += k;
              if (sh >= self.DB) sh -= self.DB;
            }
            if (k == 8 && (s[0] & 0x80) != 0) {
              self.s = -1;
              if (sh > 0) self[self.t - 1] |= ((1 << (self.DB - sh)) - 1) << sh;
            }
            self.clamp();
            if (mi) BigInteger.ZERO.subTo(self, self);
          }

          // (protected) clamp off excess high words
          function bnpClamp() {
            var c = this.s & this.DM;
            while (this.t > 0 && this[this.t - 1] == c) --this.t;
          }

          // (public) return string representation in given radix
          function bnToString(b) {
            var self = this;
            if (self.s < 0) return '-' + self.negate().toString(b);
            var k;
            if (b == 16) k = 4;
            else if (b == 8) k = 3;
            else if (b == 2) k = 1;
            else if (b == 32) k = 5;
            else if (b == 4) k = 2;
            else return self.toRadix(b);
            var km = (1 << k) - 1,
              d,
              m = false,
              r = '',
              i = self.t;
            var p = self.DB - ((i * self.DB) % k);
            if (i-- > 0) {
              if (p < self.DB && (d = self[i] >> p) > 0) {
                m = true;
                r = int2char(d);
              }
              while (i >= 0) {
                if (p < k) {
                  d = (self[i] & ((1 << p) - 1)) << (k - p);
                  d |= self[--i] >> (p += self.DB - k);
                } else {
                  d = (self[i] >> (p -= k)) & km;
                  if (p <= 0) {
                    p += self.DB;
                    --i;
                  }
                }
                if (d > 0) m = true;
                if (m) r += int2char(d);
              }
            }
            return m ? r : '0';
          }

          // (public) -this
          function bnNegate() {
            var r = new BigInteger();
            BigInteger.ZERO.subTo(this, r);
            return r;
          }

          // (public) |this|
          function bnAbs() {
            return this.s < 0 ? this.negate() : this;
          }

          // (public) return + if this > a, - if this < a, 0 if equal
          function bnCompareTo(a) {
            var r = this.s - a.s;
            if (r != 0) return r;
            var i = this.t;
            r = i - a.t;
            if (r != 0) return this.s < 0 ? -r : r;
            while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;
            return 0;
          }

          // returns bit length of the integer x
          function nbits(x) {
            var r = 1,
              t;
            if ((t = x >>> 16) != 0) {
              x = t;
              r += 16;
            }
            if ((t = x >> 8) != 0) {
              x = t;
              r += 8;
            }
            if ((t = x >> 4) != 0) {
              x = t;
              r += 4;
            }
            if ((t = x >> 2) != 0) {
              x = t;
              r += 2;
            }
            if ((t = x >> 1) != 0) {
              x = t;
              r += 1;
            }
            return r;
          }

          // (public) return the number of bits in "this"
          function bnBitLength() {
            if (this.t <= 0) return 0;
            return (
              this.DB * (this.t - 1) +
              nbits(this[this.t - 1] ^ (this.s & this.DM))
            );
          }

          // (public) return the number of bytes in "this"
          function bnByteLength() {
            return this.bitLength() >> 3;
          }

          // (protected) r = this << n*DB
          function bnpDLShiftTo(n, r) {
            var i;
            for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
            for (i = n - 1; i >= 0; --i) r[i] = 0;
            r.t = this.t + n;
            r.s = this.s;
          }

          // (protected) r = this >> n*DB
          function bnpDRShiftTo(n, r) {
            for (var i = n; i < this.t; ++i) r[i - n] = this[i];
            r.t = Math.max(this.t - n, 0);
            r.s = this.s;
          }

          // (protected) r = this << n
          function bnpLShiftTo(n, r) {
            var self = this;
            var bs = n % self.DB;
            var cbs = self.DB - bs;
            var bm = (1 << cbs) - 1;
            var ds = Math.floor(n / self.DB),
              c = (self.s << bs) & self.DM,
              i;
            for (i = self.t - 1; i >= 0; --i) {
              r[i + ds + 1] = (self[i] >> cbs) | c;
              c = (self[i] & bm) << bs;
            }
            for (i = ds - 1; i >= 0; --i) r[i] = 0;
            r[ds] = c;
            r.t = self.t + ds + 1;
            r.s = self.s;
            r.clamp();
          }

          // (protected) r = this >> n
          function bnpRShiftTo(n, r) {
            var self = this;
            r.s = self.s;
            var ds = Math.floor(n / self.DB);
            if (ds >= self.t) {
              r.t = 0;
              return;
            }
            var bs = n % self.DB;
            var cbs = self.DB - bs;
            var bm = (1 << bs) - 1;
            r[0] = self[ds] >> bs;
            for (var i = ds + 1; i < self.t; ++i) {
              r[i - ds - 1] |= (self[i] & bm) << cbs;
              r[i - ds] = self[i] >> bs;
            }
            if (bs > 0) r[self.t - ds - 1] |= (self.s & bm) << cbs;
            r.t = self.t - ds;
            r.clamp();
          }

          // (protected) r = this - a
          function bnpSubTo(a, r) {
            var self = this;
            var i = 0,
              c = 0,
              m = Math.min(a.t, self.t);
            while (i < m) {
              c += self[i] - a[i];
              r[i++] = c & self.DM;
              c >>= self.DB;
            }
            if (a.t < self.t) {
              c -= a.s;
              while (i < self.t) {
                c += self[i];
                r[i++] = c & self.DM;
                c >>= self.DB;
              }
              c += self.s;
            } else {
              c += self.s;
              while (i < a.t) {
                c -= a[i];
                r[i++] = c & self.DM;
                c >>= self.DB;
              }
              c -= a.s;
            }
            r.s = c < 0 ? -1 : 0;
            if (c < -1) r[i++] = self.DV + c;
            else if (c > 0) r[i++] = c;
            r.t = i;
            r.clamp();
          }

          // (protected) r = this * a, r != this,a (HAC 14.12)
          // "this" should be the larger one if appropriate.
          function bnpMultiplyTo(a, r) {
            var x = this.abs(),
              y = a.abs();
            var i = x.t;
            r.t = i + y.t;
            while (--i >= 0) r[i] = 0;
            for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
            r.s = 0;
            r.clamp();
            if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
          }

          // (protected) r = this^2, r != this (HAC 14.16)
          function bnpSquareTo(r) {
            var x = this.abs();
            var i = (r.t = 2 * x.t);
            while (--i >= 0) r[i] = 0;
            for (i = 0; i < x.t - 1; ++i) {
              var c = x.am(i, x[i], r, 2 * i, 0, 1);
              if (
                (r[i + x.t] += x.am(
                  i + 1,
                  2 * x[i],
                  r,
                  2 * i + 1,
                  c,
                  x.t - i - 1
                )) >= x.DV
              ) {
                r[i + x.t] -= x.DV;
                r[i + x.t + 1] = 1;
              }
            }
            if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
            r.s = 0;
            r.clamp();
          }

          // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
          // r != q, this != m.  q or r may be null.
          function bnpDivRemTo(m, q, r) {
            var self = this;
            var pm = m.abs();
            if (pm.t <= 0) return;
            var pt = self.abs();
            if (pt.t < pm.t) {
              if (q != null) q.fromInt(0);
              if (r != null) self.copyTo(r);
              return;
            }
            if (r == null) r = new BigInteger();
            var y = new BigInteger(),
              ts = self.s,
              ms = m.s;
            var nsh = self.DB - nbits(pm[pm.t - 1]); // normalize modulus
            if (nsh > 0) {
              pm.lShiftTo(nsh, y);
              pt.lShiftTo(nsh, r);
            } else {
              pm.copyTo(y);
              pt.copyTo(r);
            }
            var ys = y.t;
            var y0 = y[ys - 1];
            if (y0 == 0) return;
            var yt = y0 * (1 << self.F1) + (ys > 1 ? y[ys - 2] >> self.F2 : 0);
            var d1 = self.FV / yt,
              d2 = (1 << self.F1) / yt,
              e = 1 << self.F2;
            var i = r.t,
              j = i - ys,
              t = q == null ? new BigInteger() : q;
            y.dlShiftTo(j, t);
            if (r.compareTo(t) >= 0) {
              r[r.t++] = 1;
              r.subTo(t, r);
            }
            BigInteger.ONE.dlShiftTo(ys, t);
            t.subTo(y, y); // "negative" y so we can replace sub with am later
            while (y.t < ys) y[y.t++] = 0;
            while (--j >= 0) {
              // Estimate quotient digit
              var qd =
                r[--i] == y0
                  ? self.DM
                  : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
              if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                // Try it out
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd) r.subTo(t, r);
              }
            }
            if (q != null) {
              r.drShiftTo(ys, q);
              if (ts != ms) BigInteger.ZERO.subTo(q, q);
            }
            r.t = ys;
            r.clamp();
            if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
            if (ts < 0) BigInteger.ZERO.subTo(r, r);
          }

          // (public) this mod a
          function bnMod(a) {
            var r = new BigInteger();
            this.abs().divRemTo(a, null, r);
            if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
            return r;
          }

          // Modular reduction using "classic" algorithm
          function Classic(m) {
            this.m = m;
          }

          function cConvert(x) {
            if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
            else return x;
          }

          function cRevert(x) {
            return x;
          }

          function cReduce(x) {
            x.divRemTo(this.m, null, x);
          }

          function cMulTo(x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
          }

          function cSqrTo(x, r) {
            x.squareTo(r);
            this.reduce(r);
          }

          Classic.prototype.convert = cConvert;
          Classic.prototype.revert = cRevert;
          Classic.prototype.reduce = cReduce;
          Classic.prototype.mulTo = cMulTo;
          Classic.prototype.sqrTo = cSqrTo;

          // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
          // justification:
          //         xy == 1 (mod m)
          //         xy =  1+km
          //   xy(2-xy) = (1+km)(1-km)
          // x[y(2-xy)] = 1-k^2m^2
          // x[y(2-xy)] == 1 (mod m^2)
          // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
          // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
          // JS multiply "overflows" differently from C/C++, so care is needed here.
          function bnpInvDigit() {
            if (this.t < 1) return 0;
            var x = this[0];
            if ((x & 1) == 0) return 0;
            var y = x & 3; // y == 1/x mod 2^2
            y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
            y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
            y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
            // last step - calculate inverse mod DV directly
            // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
            y = (y * (2 - ((x * y) % this.DV))) % this.DV; // y == 1/x mod 2^dbits
            // we really want the negative inverse, and -DV < y < DV
            return y > 0 ? this.DV - y : -y;
          }

          // Montgomery reduction
          function Montgomery(m) {
            this.m = m;
            this.mp = m.invDigit();
            this.mpl = this.mp & 0x7fff;
            this.mph = this.mp >> 15;
            this.um = (1 << (m.DB - 15)) - 1;
            this.mt2 = 2 * m.t;
          }

          // xR mod m
          function montConvert(x) {
            var r = new BigInteger();
            x.abs().dlShiftTo(this.m.t, r);
            r.divRemTo(this.m, null, r);
            if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
            return r;
          }

          // x/R mod m
          function montRevert(x) {
            var r = new BigInteger();
            x.copyTo(r);
            this.reduce(r);
            return r;
          }

          // x = x/R mod m (HAC 14.32)
          function montReduce(x) {
            while (x.t <= this.mt2)
              // pad x so am has enough room later
              x[x.t++] = 0;
            for (var i = 0; i < this.m.t; ++i) {
              // faster way of calculating u0 = x[i]*mp mod DV
              var j = x[i] & 0x7fff;
              var u0 =
                (j * this.mpl +
                  (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) <<
                    15)) &
                x.DM;
              // use am to combine the multiply-shift-add into one call
              j = i + this.m.t;
              x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
              // propagate carry
              while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j]++;
              }
            }
            x.clamp();
            x.drShiftTo(this.m.t, x);
            if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
          }

          // r = "x^2/R mod m"; x != r
          function montSqrTo(x, r) {
            x.squareTo(r);
            this.reduce(r);
          }

          // r = "xy/R mod m"; x,y != r
          function montMulTo(x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
          }

          Montgomery.prototype.convert = montConvert;
          Montgomery.prototype.revert = montRevert;
          Montgomery.prototype.reduce = montReduce;
          Montgomery.prototype.mulTo = montMulTo;
          Montgomery.prototype.sqrTo = montSqrTo;

          // (protected) true iff this is even
          function bnpIsEven() {
            return (this.t > 0 ? this[0] & 1 : this.s) == 0;
          }

          // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
          function bnpExp(e, z) {
            if (e > 0xffffffff || e < 1) return BigInteger.ONE;
            var r = new BigInteger(),
              r2 = new BigInteger(),
              g = z.convert(this),
              i = nbits(e) - 1;
            g.copyTo(r);
            while (--i >= 0) {
              z.sqrTo(r, r2);
              if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
              else {
                var t = r;
                r = r2;
                r2 = t;
              }
            }
            return z.revert(r);
          }

          // (public) this^e % m, 0 <= e < 2^32
          function bnModPowInt(e, m) {
            var z;
            if (e < 256 || m.isEven()) z = new Classic(m);
            else z = new Montgomery(m);
            return this.exp(e, z);
          }

          // protected
          proto.copyTo = bnpCopyTo;
          proto.fromInt = bnpFromInt;
          proto.fromString = bnpFromString;
          proto.clamp = bnpClamp;
          proto.dlShiftTo = bnpDLShiftTo;
          proto.drShiftTo = bnpDRShiftTo;
          proto.lShiftTo = bnpLShiftTo;
          proto.rShiftTo = bnpRShiftTo;
          proto.subTo = bnpSubTo;
          proto.multiplyTo = bnpMultiplyTo;
          proto.squareTo = bnpSquareTo;
          proto.divRemTo = bnpDivRemTo;
          proto.invDigit = bnpInvDigit;
          proto.isEven = bnpIsEven;
          proto.exp = bnpExp;

          // public
          proto.toString = bnToString;
          proto.negate = bnNegate;
          proto.abs = bnAbs;
          proto.compareTo = bnCompareTo;
          proto.bitLength = bnBitLength;
          proto.byteLength = bnByteLength;
          proto.mod = bnMod;
          proto.modPowInt = bnModPowInt;

          // (public)
          function bnClone() {
            var r = new BigInteger();
            this.copyTo(r);
            return r;
          }

          // (public) return value as integer
          function bnIntValue() {
            if (this.s < 0) {
              if (this.t == 1) return this[0] - this.DV;
              else if (this.t == 0) return -1;
            } else if (this.t == 1) return this[0];
            else if (this.t == 0) return 0;
            // assumes 16 < DB < 32
            return (
              ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0]
            );
          }

          // (public) return value as byte
          function bnByteValue() {
            return this.t == 0 ? this.s : (this[0] << 24) >> 24;
          }

          // (public) return value as short (assumes DB>=16)
          function bnShortValue() {
            return this.t == 0 ? this.s : (this[0] << 16) >> 16;
          }

          // (protected) return x s.t. r^x < DV
          function bnpChunkSize(r) {
            return Math.floor((Math.LN2 * this.DB) / Math.log(r));
          }

          // (public) 0 if this == 0, 1 if this > 0
          function bnSigNum() {
            if (this.s < 0) return -1;
            else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
            else return 1;
          }

          // (protected) convert to radix string
          function bnpToRadix(b) {
            if (b == null) b = 10;
            if (this.signum() == 0 || b < 2 || b > 36) return '0';
            var cs = this.chunkSize(b);
            var a = Math.pow(b, cs);
            var d = nbv(a),
              y = new BigInteger(),
              z = new BigInteger(),
              r = '';
            this.divRemTo(d, y, z);
            while (y.signum() > 0) {
              r = (a + z.intValue()).toString(b).substr(1) + r;
              y.divRemTo(d, y, z);
            }
            return z.intValue().toString(b) + r;
          }

          // (protected) convert from radix string
          function bnpFromRadix(s, b) {
            var self = this;
            self.fromInt(0);
            if (b == null) b = 10;
            var cs = self.chunkSize(b);
            var d = Math.pow(b, cs),
              mi = false,
              j = 0,
              w = 0;
            for (var i = 0; i < s.length; ++i) {
              var x = intAt(s, i);
              if (x < 0) {
                if (s.charAt(i) == '-' && self.signum() == 0) mi = true;
                continue;
              }
              w = b * w + x;
              if (++j >= cs) {
                self.dMultiply(d);
                self.dAddOffset(w, 0);
                j = 0;
                w = 0;
              }
            }
            if (j > 0) {
              self.dMultiply(Math.pow(b, j));
              self.dAddOffset(w, 0);
            }
            if (mi) BigInteger.ZERO.subTo(self, self);
          }

          // (protected) alternate constructor
          function bnpFromNumber(a, b, c) {
            var self = this;
            if ('number' == typeof b) {
              // new BigInteger(int,int,RNG)
              if (a < 2) self.fromInt(1);
              else {
                self.fromNumber(a, c);
                if (!self.testBit(a - 1))
                  // force MSB set
                  self.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, self);
                if (self.isEven()) self.dAddOffset(1, 0); // force odd
                while (!self.isProbablePrime(b)) {
                  self.dAddOffset(2, 0);
                  if (self.bitLength() > a)
                    self.subTo(BigInteger.ONE.shiftLeft(a - 1), self);
                }
              }
            } else {
              // new BigInteger(int,RNG)
              var x = new Array(),
                t = a & 7;
              x.length = (a >> 3) + 1;
              b.nextBytes(x);
              if (t > 0) x[0] &= (1 << t) - 1;
              else x[0] = 0;
              self.fromString(x, 256);
            }
          }

          // (public) convert to bigendian byte array
          function bnToByteArray() {
            var self = this;
            var i = self.t,
              r = new Array();
            r[0] = self.s;
            var p = self.DB - ((i * self.DB) % 8),
              d,
              k = 0;
            if (i-- > 0) {
              if (p < self.DB && (d = self[i] >> p) != (self.s & self.DM) >> p)
                r[k++] = d | (self.s << (self.DB - p));
              while (i >= 0) {
                if (p < 8) {
                  d = (self[i] & ((1 << p) - 1)) << (8 - p);
                  d |= self[--i] >> (p += self.DB - 8);
                } else {
                  d = (self[i] >> (p -= 8)) & 0xff;
                  if (p <= 0) {
                    p += self.DB;
                    --i;
                  }
                }
                if ((d & 0x80) != 0) d |= -256;
                if (k === 0 && (self.s & 0x80) != (d & 0x80)) ++k;
                if (k > 0 || d != self.s) r[k++] = d;
              }
            }
            return r;
          }

          function bnEquals(a) {
            return this.compareTo(a) == 0;
          }

          function bnMin(a) {
            return this.compareTo(a) < 0 ? this : a;
          }

          function bnMax(a) {
            return this.compareTo(a) > 0 ? this : a;
          }

          // (protected) r = this op a (bitwise)
          function bnpBitwiseTo(a, op, r) {
            var self = this;
            var i,
              f,
              m = Math.min(a.t, self.t);
            for (i = 0; i < m; ++i) r[i] = op(self[i], a[i]);
            if (a.t < self.t) {
              f = a.s & self.DM;
              for (i = m; i < self.t; ++i) r[i] = op(self[i], f);
              r.t = self.t;
            } else {
              f = self.s & self.DM;
              for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
              r.t = a.t;
            }
            r.s = op(self.s, a.s);
            r.clamp();
          }

          // (public) this & a
          function op_and(x, y) {
            return x & y;
          }

          function bnAnd(a) {
            var r = new BigInteger();
            this.bitwiseTo(a, op_and, r);
            return r;
          }

          // (public) this | a
          function op_or(x, y) {
            return x | y;
          }

          function bnOr(a) {
            var r = new BigInteger();
            this.bitwiseTo(a, op_or, r);
            return r;
          }

          // (public) this ^ a
          function op_xor(x, y) {
            return x ^ y;
          }

          function bnXor(a) {
            var r = new BigInteger();
            this.bitwiseTo(a, op_xor, r);
            return r;
          }

          // (public) this & ~a
          function op_andnot(x, y) {
            return x & ~y;
          }

          function bnAndNot(a) {
            var r = new BigInteger();
            this.bitwiseTo(a, op_andnot, r);
            return r;
          }

          // (public) ~this
          function bnNot() {
            var r = new BigInteger();
            for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
            r.t = this.t;
            r.s = ~this.s;
            return r;
          }

          // (public) this << n
          function bnShiftLeft(n) {
            var r = new BigInteger();
            if (n < 0) this.rShiftTo(-n, r);
            else this.lShiftTo(n, r);
            return r;
          }

          // (public) this >> n
          function bnShiftRight(n) {
            var r = new BigInteger();
            if (n < 0) this.lShiftTo(-n, r);
            else this.rShiftTo(n, r);
            return r;
          }

          // return index of lowest 1-bit in x, x < 2^31
          function lbit(x) {
            if (x == 0) return -1;
            var r = 0;
            if ((x & 0xffff) == 0) {
              x >>= 16;
              r += 16;
            }
            if ((x & 0xff) == 0) {
              x >>= 8;
              r += 8;
            }
            if ((x & 0xf) == 0) {
              x >>= 4;
              r += 4;
            }
            if ((x & 3) == 0) {
              x >>= 2;
              r += 2;
            }
            if ((x & 1) == 0) ++r;
            return r;
          }

          // (public) returns index of lowest 1-bit (or -1 if none)
          function bnGetLowestSetBit() {
            for (var i = 0; i < this.t; ++i)
              if (this[i] != 0) return i * this.DB + lbit(this[i]);
            if (this.s < 0) return this.t * this.DB;
            return -1;
          }

          // return number of 1 bits in x
          function cbit(x) {
            var r = 0;
            while (x != 0) {
              x &= x - 1;
              ++r;
            }
            return r;
          }

          // (public) return number of set bits
          function bnBitCount() {
            var r = 0,
              x = this.s & this.DM;
            for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
            return r;
          }

          // (public) true iff nth bit is set
          function bnTestBit(n) {
            var j = Math.floor(n / this.DB);
            if (j >= this.t) return this.s != 0;
            return (this[j] & (1 << n % this.DB)) != 0;
          }

          // (protected) this op (1<<n)
          function bnpChangeBit(n, op) {
            var r = BigInteger.ONE.shiftLeft(n);
            this.bitwiseTo(r, op, r);
            return r;
          }

          // (public) this | (1<<n)
          function bnSetBit(n) {
            return this.changeBit(n, op_or);
          }

          // (public) this & ~(1<<n)
          function bnClearBit(n) {
            return this.changeBit(n, op_andnot);
          }

          // (public) this ^ (1<<n)
          function bnFlipBit(n) {
            return this.changeBit(n, op_xor);
          }

          // (protected) r = this + a
          function bnpAddTo(a, r) {
            var self = this;

            var i = 0,
              c = 0,
              m = Math.min(a.t, self.t);
            while (i < m) {
              c += self[i] + a[i];
              r[i++] = c & self.DM;
              c >>= self.DB;
            }
            if (a.t < self.t) {
              c += a.s;
              while (i < self.t) {
                c += self[i];
                r[i++] = c & self.DM;
                c >>= self.DB;
              }
              c += self.s;
            } else {
              c += self.s;
              while (i < a.t) {
                c += a[i];
                r[i++] = c & self.DM;
                c >>= self.DB;
              }
              c += a.s;
            }
            r.s = c < 0 ? -1 : 0;
            if (c > 0) r[i++] = c;
            else if (c < -1) r[i++] = self.DV + c;
            r.t = i;
            r.clamp();
          }

          // (public) this + a
          function bnAdd(a) {
            var r = new BigInteger();
            this.addTo(a, r);
            return r;
          }

          // (public) this - a
          function bnSubtract(a) {
            var r = new BigInteger();
            this.subTo(a, r);
            return r;
          }

          // (public) this * a
          function bnMultiply(a) {
            var r = new BigInteger();
            this.multiplyTo(a, r);
            return r;
          }

          // (public) this^2
          function bnSquare() {
            var r = new BigInteger();
            this.squareTo(r);
            return r;
          }

          // (public) this / a
          function bnDivide(a) {
            var r = new BigInteger();
            this.divRemTo(a, r, null);
            return r;
          }

          // (public) this % a
          function bnRemainder(a) {
            var r = new BigInteger();
            this.divRemTo(a, null, r);
            return r;
          }

          // (public) [this/a,this%a]
          function bnDivideAndRemainder(a) {
            var q = new BigInteger(),
              r = new BigInteger();
            this.divRemTo(a, q, r);
            return new Array(q, r);
          }

          // (protected) this *= n, this >= 0, 1 < n < DV
          function bnpDMultiply(n) {
            this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
            ++this.t;
            this.clamp();
          }

          // (protected) this += n << w words, this >= 0
          function bnpDAddOffset(n, w) {
            if (n == 0) return;
            while (this.t <= w) this[this.t++] = 0;
            this[w] += n;
            while (this[w] >= this.DV) {
              this[w] -= this.DV;
              if (++w >= this.t) this[this.t++] = 0;
              ++this[w];
            }
          }

          // A "null" reducer
          function NullExp() {}

          function nNop(x) {
            return x;
          }

          function nMulTo(x, y, r) {
            x.multiplyTo(y, r);
          }

          function nSqrTo(x, r) {
            x.squareTo(r);
          }

          NullExp.prototype.convert = nNop;
          NullExp.prototype.revert = nNop;
          NullExp.prototype.mulTo = nMulTo;
          NullExp.prototype.sqrTo = nSqrTo;

          // (public) this^e
          function bnPow(e) {
            return this.exp(e, new NullExp());
          }

          // (protected) r = lower n words of "this * a", a.t <= n
          // "this" should be the larger one if appropriate.
          function bnpMultiplyLowerTo(a, n, r) {
            var i = Math.min(this.t + a.t, n);
            r.s = 0; // assumes a,this >= 0
            r.t = i;
            while (i > 0) r[--i] = 0;
            var j;
            for (j = r.t - this.t; i < j; ++i)
              r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
            for (j = Math.min(a.t, n); i < j; ++i)
              this.am(0, a[i], r, i, 0, n - i);
            r.clamp();
          }

          // (protected) r = "this * a" without lower n words, n > 0
          // "this" should be the larger one if appropriate.
          function bnpMultiplyUpperTo(a, n, r) {
            --n;
            var i = (r.t = this.t + a.t - n);
            r.s = 0; // assumes a,this >= 0
            while (--i >= 0) r[i] = 0;
            for (i = Math.max(n - this.t, 0); i < a.t; ++i)
              r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
            r.clamp();
            r.drShiftTo(1, r);
          }

          // Barrett modular reduction
          function Barrett(m) {
            // setup Barrett
            this.r2 = new BigInteger();
            this.q3 = new BigInteger();
            BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
            this.mu = this.r2.divide(m);
            this.m = m;
          }

          function barrettConvert(x) {
            if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
            else if (x.compareTo(this.m) < 0) return x;
            else {
              var r = new BigInteger();
              x.copyTo(r);
              this.reduce(r);
              return r;
            }
          }

          function barrettRevert(x) {
            return x;
          }

          // x = x mod m (HAC 14.42)
          function barrettReduce(x) {
            var self = this;
            x.drShiftTo(self.m.t - 1, self.r2);
            if (x.t > self.m.t + 1) {
              x.t = self.m.t + 1;
              x.clamp();
            }
            self.mu.multiplyUpperTo(self.r2, self.m.t + 1, self.q3);
            self.m.multiplyLowerTo(self.q3, self.m.t + 1, self.r2);
            while (x.compareTo(self.r2) < 0) x.dAddOffset(1, self.m.t + 1);
            x.subTo(self.r2, x);
            while (x.compareTo(self.m) >= 0) x.subTo(self.m, x);
          }

          // r = x^2 mod m; x != r
          function barrettSqrTo(x, r) {
            x.squareTo(r);
            this.reduce(r);
          }

          // r = x*y mod m; x,y != r
          function barrettMulTo(x, y, r) {
            x.multiplyTo(y, r);
            this.reduce(r);
          }

          Barrett.prototype.convert = barrettConvert;
          Barrett.prototype.revert = barrettRevert;
          Barrett.prototype.reduce = barrettReduce;
          Barrett.prototype.mulTo = barrettMulTo;
          Barrett.prototype.sqrTo = barrettSqrTo;

          // (public) this^e % m (HAC 14.85)
          function bnModPow(e, m) {
            var i = e.bitLength(),
              k,
              r = nbv(1),
              z;
            if (i <= 0) return r;
            else if (i < 18) k = 1;
            else if (i < 48) k = 3;
            else if (i < 144) k = 4;
            else if (i < 768) k = 5;
            else k = 6;
            if (i < 8) z = new Classic(m);
            else if (m.isEven()) z = new Barrett(m);
            else z = new Montgomery(m);

            // precomputation
            var g = new Array(),
              n = 3,
              k1 = k - 1,
              km = (1 << k) - 1;
            g[1] = z.convert(this);
            if (k > 1) {
              var g2 = new BigInteger();
              z.sqrTo(g[1], g2);
              while (n <= km) {
                g[n] = new BigInteger();
                z.mulTo(g2, g[n - 2], g[n]);
                n += 2;
              }
            }

            var j = e.t - 1,
              w,
              is1 = true,
              r2 = new BigInteger(),
              t;
            i = nbits(e[j]) - 1;
            while (j >= 0) {
              if (i >= k1) w = (e[j] >> (i - k1)) & km;
              else {
                w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
                if (j > 0) w |= e[j - 1] >> (this.DB + i - k1);
              }

              n = k;
              while ((w & 1) == 0) {
                w >>= 1;
                --n;
              }
              if ((i -= n) < 0) {
                i += this.DB;
                --j;
              }
              if (is1) {
                // ret == 1, don't bother squaring or multiplying it
                g[w].copyTo(r);
                is1 = false;
              } else {
                while (n > 1) {
                  z.sqrTo(r, r2);
                  z.sqrTo(r2, r);
                  n -= 2;
                }
                if (n > 0) z.sqrTo(r, r2);
                else {
                  t = r;
                  r = r2;
                  r2 = t;
                }
                z.mulTo(r2, g[w], r);
              }

              while (j >= 0 && (e[j] & (1 << i)) == 0) {
                z.sqrTo(r, r2);
                t = r;
                r = r2;
                r2 = t;
                if (--i < 0) {
                  i = this.DB - 1;
                  --j;
                }
              }
            }
            return z.revert(r);
          }

          // (public) gcd(this,a) (HAC 14.54)
          function bnGCD(a) {
            var x = this.s < 0 ? this.negate() : this.clone();
            var y = a.s < 0 ? a.negate() : a.clone();
            if (x.compareTo(y) < 0) {
              var t = x;
              x = y;
              y = t;
            }
            var i = x.getLowestSetBit(),
              g = y.getLowestSetBit();
            if (g < 0) return x;
            if (i < g) g = i;
            if (g > 0) {
              x.rShiftTo(g, x);
              y.rShiftTo(g, y);
            }
            while (x.signum() > 0) {
              if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
              if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
              if (x.compareTo(y) >= 0) {
                x.subTo(y, x);
                x.rShiftTo(1, x);
              } else {
                y.subTo(x, y);
                y.rShiftTo(1, y);
              }
            }
            if (g > 0) y.lShiftTo(g, y);
            return y;
          }

          // (protected) this % n, n < 2^26
          function bnpModInt(n) {
            if (n <= 0) return 0;
            var d = this.DV % n,
              r = this.s < 0 ? n - 1 : 0;
            if (this.t > 0)
              if (d == 0) r = this[0] % n;
              else
                for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
            return r;
          }

          // (public) 1/this % m (HAC 14.61)
          function bnModInverse(m) {
            var ac = m.isEven();
            if (this.signum() === 0) throw new Error('division by zero');
            if ((this.isEven() && ac) || m.signum() == 0)
              return BigInteger.ZERO;
            var u = m.clone(),
              v = this.clone();
            var a = nbv(1),
              b = nbv(0),
              c = nbv(0),
              d = nbv(1);
            while (u.signum() != 0) {
              while (u.isEven()) {
                u.rShiftTo(1, u);
                if (ac) {
                  if (!a.isEven() || !b.isEven()) {
                    a.addTo(this, a);
                    b.subTo(m, b);
                  }
                  a.rShiftTo(1, a);
                } else if (!b.isEven()) b.subTo(m, b);
                b.rShiftTo(1, b);
              }
              while (v.isEven()) {
                v.rShiftTo(1, v);
                if (ac) {
                  if (!c.isEven() || !d.isEven()) {
                    c.addTo(this, c);
                    d.subTo(m, d);
                  }
                  c.rShiftTo(1, c);
                } else if (!d.isEven()) d.subTo(m, d);
                d.rShiftTo(1, d);
              }
              if (u.compareTo(v) >= 0) {
                u.subTo(v, u);
                if (ac) a.subTo(c, a);
                b.subTo(d, b);
              } else {
                v.subTo(u, v);
                if (ac) c.subTo(a, c);
                d.subTo(b, d);
              }
            }
            if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
            while (d.compareTo(m) >= 0) d.subTo(m, d);
            while (d.signum() < 0) d.addTo(m, d);
            return d;
          }

          var lowprimes = [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61,
            67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137,
            139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199,
            211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277,
            281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359,
            367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439,
            443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521,
            523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607,
            613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683,
            691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773,
            787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863,
            877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967,
            971, 977, 983, 991, 997,
          ];

          var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

          // (public) test primality with certainty >= 1-.5^t
          function bnIsProbablePrime(t) {
            var i,
              x = this.abs();
            if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
              for (i = 0; i < lowprimes.length; ++i)
                if (x[0] == lowprimes[i]) return true;
              return false;
            }
            if (x.isEven()) return false;
            i = 1;
            while (i < lowprimes.length) {
              var m = lowprimes[i],
                j = i + 1;
              while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
              m = x.modInt(m);
              while (i < j) if (m % lowprimes[i++] == 0) return false;
            }
            return x.millerRabin(t);
          }

          // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
          function bnpMillerRabin(t) {
            var n1 = this.subtract(BigInteger.ONE);
            var k = n1.getLowestSetBit();
            if (k <= 0) return false;
            var r = n1.shiftRight(k);
            t = (t + 1) >> 1;
            if (t > lowprimes.length) t = lowprimes.length;
            var a = new BigInteger(null);
            var j,
              bases = [];
            for (var i = 0; i < t; ++i) {
              for (;;) {
                j = lowprimes[Math.floor(Math.random() * lowprimes.length)];
                if (bases.indexOf(j) == -1) break;
              }
              bases.push(j);
              a.fromInt(j);
              var y = a.modPow(r, this);
              if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
                var j = 1;
                while (j++ < k && y.compareTo(n1) != 0) {
                  y = y.modPowInt(2, this);
                  if (y.compareTo(BigInteger.ONE) == 0) return false;
                }
                if (y.compareTo(n1) != 0) return false;
              }
            }
            return true;
          }

          // protected
          proto.chunkSize = bnpChunkSize;
          proto.toRadix = bnpToRadix;
          proto.fromRadix = bnpFromRadix;
          proto.fromNumber = bnpFromNumber;
          proto.bitwiseTo = bnpBitwiseTo;
          proto.changeBit = bnpChangeBit;
          proto.addTo = bnpAddTo;
          proto.dMultiply = bnpDMultiply;
          proto.dAddOffset = bnpDAddOffset;
          proto.multiplyLowerTo = bnpMultiplyLowerTo;
          proto.multiplyUpperTo = bnpMultiplyUpperTo;
          proto.modInt = bnpModInt;
          proto.millerRabin = bnpMillerRabin;

          // public
          proto.clone = bnClone;
          proto.intValue = bnIntValue;
          proto.byteValue = bnByteValue;
          proto.shortValue = bnShortValue;
          proto.signum = bnSigNum;
          proto.toByteArray = bnToByteArray;
          proto.equals = bnEquals;
          proto.min = bnMin;
          proto.max = bnMax;
          proto.and = bnAnd;
          proto.or = bnOr;
          proto.xor = bnXor;
          proto.andNot = bnAndNot;
          proto.not = bnNot;
          proto.shiftLeft = bnShiftLeft;
          proto.shiftRight = bnShiftRight;
          proto.getLowestSetBit = bnGetLowestSetBit;
          proto.bitCount = bnBitCount;
          proto.testBit = bnTestBit;
          proto.setBit = bnSetBit;
          proto.clearBit = bnClearBit;
          proto.flipBit = bnFlipBit;
          proto.add = bnAdd;
          proto.subtract = bnSubtract;
          proto.multiply = bnMultiply;
          proto.divide = bnDivide;
          proto.remainder = bnRemainder;
          proto.divideAndRemainder = bnDivideAndRemainder;
          proto.modPow = bnModPow;
          proto.modInverse = bnModInverse;
          proto.pow = bnPow;
          proto.gcd = bnGCD;
          proto.isProbablePrime = bnIsProbablePrime;

          // JSBN-specific extension
          proto.square = bnSquare;

          // constants
          BigInteger.ZERO = nbv(0);
          BigInteger.ONE = nbv(1);
          BigInteger.valueOf = nbv;

          module.exports = BigInteger;
        },
        { '../package.json': 37 },
      ],
      35: [
        function (require, module, exports) {
          (function (Buffer) {
            (function () {
              // FIXME: Kind of a weird way to throw exceptions, consider removing
              var assert = require('assert');
              var BigInteger = require('./bigi');

              /**
               * Turns a byte array into a big integer.
               *
               * This function will interpret a byte array as a big integer in big
               * endian notation.
               */
              BigInteger.fromByteArrayUnsigned = function (byteArray) {
                // BigInteger expects a DER integer conformant byte array
                if (byteArray[0] & 0x80) {
                  return new BigInteger([0].concat(byteArray));
                }

                return new BigInteger(byteArray);
              };

              /**
               * Returns a byte array representation of the big integer.
               *
               * This returns the absolute of the contained value in big endian
               * form. A value of zero results in an empty array.
               */
              BigInteger.prototype.toByteArrayUnsigned = function () {
                var byteArray = this.toByteArray();
                return byteArray[0] === 0 ? byteArray.slice(1) : byteArray;
              };

              BigInteger.fromDERInteger = function (byteArray) {
                return new BigInteger(byteArray);
              };

              /*
               * Converts BigInteger to a DER integer representation.
               *
               * The format for this value uses the most significant bit as a sign
               * bit.  If the most significant bit is already set and the integer is
               * positive, a 0x00 is prepended.
               *
               * Examples:
               *
               *      0 =>     0x00
               *      1 =>     0x01
               *     -1 =>     0xff
               *    127 =>     0x7f
               *   -127 =>     0x81
               *    128 =>   0x0080
               *   -128 =>     0x80
               *    255 =>   0x00ff
               *   -255 =>   0xff01
               *  16300 =>   0x3fac
               * -16300 =>   0xc054
               *  62300 => 0x00f35c
               * -62300 => 0xff0ca4
               */
              BigInteger.prototype.toDERInteger =
                BigInteger.prototype.toByteArray;

              BigInteger.fromBuffer = function (buffer) {
                // BigInteger expects a DER integer conformant byte array
                if (buffer[0] & 0x80) {
                  var byteArray = Array.prototype.slice.call(buffer);

                  return new BigInteger([0].concat(byteArray));
                }

                return new BigInteger(buffer);
              };

              BigInteger.fromHex = function (hex) {
                if (hex === '') return BigInteger.ZERO;

                assert.equal(
                  hex,
                  hex.match(/^[A-Fa-f0-9]+/),
                  'Invalid hex string'
                );
                assert.equal(hex.length % 2, 0, 'Incomplete hex');
                return new BigInteger(hex, 16);
              };

              BigInteger.prototype.toBuffer = function (size) {
                var byteArray = this.toByteArrayUnsigned();
                var zeros = [];

                var padding = size - byteArray.length;
                while (zeros.length < padding) zeros.push(0);

                return new Buffer(zeros.concat(byteArray));
              };

              BigInteger.prototype.toHex = function (size) {
                return this.toBuffer(size).toString('hex');
              };
            }.call(this));
          }.call(this, require('buffer').Buffer));
        },
        { './bigi': 34, assert: 1, buffer: 7 },
      ],
      36: [
        function (require, module, exports) {
          var BigInteger = require('./bigi');

          //addons
          require('./convert');

          module.exports = BigInteger;
        },
        { './bigi': 34, './convert': 35 },
      ],
      37: [
        function (require, module, exports) {
          module.exports = {
            name: 'bigi',
            version: '1.4.2',
            description: 'Big integers.',
            keywords: [
              'cryptography',
              'math',
              'bitcoin',
              'arbitrary',
              'precision',
              'arithmetic',
              'big',
              'integer',
              'int',
              'number',
              'biginteger',
              'bigint',
              'bignumber',
              'decimal',
              'float',
            ],
            devDependencies: {
              coveralls: '^2.11.2',
              istanbul: '^0.3.5',
              jshint: '^2.5.1',
              mocha: '^2.1.0',
              mochify: '^2.1.0',
            },
            repository: {
              url: 'https://github.com/cryptocoinjs/bigi',
              type: 'git',
            },
            main: './lib/index.js',
            scripts: {
              'browser-test': './node_modules/.bin/mochify --wd -R spec',
              test: './node_modules/.bin/_mocha -- test/*.js',
              jshint:
                './node_modules/.bin/jshint --config jshint.json lib/*.js ; true',
              unit: './node_modules/.bin/mocha',
              coverage:
                './node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --reporter list test/*.js',
              coveralls:
                'npm run-script coverage && node ./node_modules/.bin/coveralls < coverage/lcov.info',
            },
            dependencies: {},
            testling: {
              files: 'test/*.js',
              harness: 'mocha',
              browsers: [
                'ie/9..latest',
                'firefox/latest',
                'chrome/latest',
                'safari/6.0..latest',
                'iphone/6.0..latest',
                'android-browser/4.2..latest',
              ],
            },
          };
        },
        {},
      ],
      38: [
        function (require, module, exports) {
          // Reference https://github.com/bitcoin/bips/blob/master/bip-0066.mediawiki
          // Format: 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
          // NOTE: SIGHASH byte ignored AND restricted, truncate before use

          var Buffer = require('safe-buffer').Buffer;

          function check(buffer) {
            if (buffer.length < 8) return false;
            if (buffer.length > 72) return false;
            if (buffer[0] !== 0x30) return false;
            if (buffer[1] !== buffer.length - 2) return false;
            if (buffer[2] !== 0x02) return false;

            var lenR = buffer[3];
            if (lenR === 0) return false;
            if (5 + lenR >= buffer.length) return false;
            if (buffer[4 + lenR] !== 0x02) return false;

            var lenS = buffer[5 + lenR];
            if (lenS === 0) return false;
            if (6 + lenR + lenS !== buffer.length) return false;

            if (buffer[4] & 0x80) return false;
            if (lenR > 1 && buffer[4] === 0x00 && !(buffer[5] & 0x80))
              return false;

            if (buffer[lenR + 6] & 0x80) return false;
            if (
              lenS > 1 &&
              buffer[lenR + 6] === 0x00 &&
              !(buffer[lenR + 7] & 0x80)
            )
              return false;
            return true;
          }

          function decode(buffer) {
            if (buffer.length < 8)
              throw new Error('DER sequence length is too short');
            if (buffer.length > 72)
              throw new Error('DER sequence length is too long');
            if (buffer[0] !== 0x30) throw new Error('Expected DER sequence');
            if (buffer[1] !== buffer.length - 2)
              throw new Error('DER sequence length is invalid');
            if (buffer[2] !== 0x02) throw new Error('Expected DER integer');

            var lenR = buffer[3];
            if (lenR === 0) throw new Error('R length is zero');
            if (5 + lenR >= buffer.length)
              throw new Error('R length is too long');
            if (buffer[4 + lenR] !== 0x02)
              throw new Error('Expected DER integer (2)');

            var lenS = buffer[5 + lenR];
            if (lenS === 0) throw new Error('S length is zero');
            if (6 + lenR + lenS !== buffer.length)
              throw new Error('S length is invalid');

            if (buffer[4] & 0x80) throw new Error('R value is negative');
            if (lenR > 1 && buffer[4] === 0x00 && !(buffer[5] & 0x80))
              throw new Error('R value excessively padded');

            if (buffer[lenR + 6] & 0x80) throw new Error('S value is negative');
            if (
              lenS > 1 &&
              buffer[lenR + 6] === 0x00 &&
              !(buffer[lenR + 7] & 0x80)
            )
              throw new Error('S value excessively padded');

            // non-BIP66 - extract R, S values
            return {
              r: buffer.slice(4, 4 + lenR),
              s: buffer.slice(6 + lenR),
            };
          }

          /*
           * Expects r and s to be positive DER integers.
           *
           * The DER format uses the most significant bit as a sign bit (& 0x80).
           * If the significant bit is set AND the integer is positive, a 0x00 is prepended.
           *
           * Examples:
           *
           *      0 =>     0x00
           *      1 =>     0x01
           *     -1 =>     0xff
           *    127 =>     0x7f
           *   -127 =>     0x81
           *    128 =>   0x0080
           *   -128 =>     0x80
           *    255 =>   0x00ff
           *   -255 =>   0xff01
           *  16300 =>   0x3fac
           * -16300 =>   0xc054
           *  62300 => 0x00f35c
           * -62300 => 0xff0ca4
           */
          function encode(r, s) {
            var lenR = r.length;
            var lenS = s.length;
            if (lenR === 0) throw new Error('R length is zero');
            if (lenS === 0) throw new Error('S length is zero');
            if (lenR > 33) throw new Error('R length is too long');
            if (lenS > 33) throw new Error('S length is too long');
            if (r[0] & 0x80) throw new Error('R value is negative');
            if (s[0] & 0x80) throw new Error('S value is negative');
            if (lenR > 1 && r[0] === 0x00 && !(r[1] & 0x80))
              throw new Error('R value excessively padded');
            if (lenS > 1 && s[0] === 0x00 && !(s[1] & 0x80))
              throw new Error('S value excessively padded');

            var signature = Buffer.allocUnsafe(6 + lenR + lenS);

            // 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
            signature[0] = 0x30;
            signature[1] = signature.length - 2;
            signature[2] = 0x02;
            signature[3] = r.length;
            r.copy(signature, 4);
            signature[4 + lenR] = 0x02;
            signature[5 + lenR] = s.length;
            s.copy(signature, 6 + lenR);

            return signature;
          }

          module.exports = {
            check: check,
            decode: decode,
            encode: encode,
          };
        },
        { 'safe-buffer': 76 },
      ],
      39: [
        function (require, module, exports) {
          module.exports = {
            OP_FALSE: 0,
            OP_0: 0,
            OP_PUSHDATA1: 76,
            OP_PUSHDATA2: 77,
            OP_PUSHDATA4: 78,
            OP_1NEGATE: 79,
            OP_RESERVED: 80,
            OP_TRUE: 81,
            OP_1: 81,
            OP_2: 82,
            OP_3: 83,
            OP_4: 84,
            OP_5: 85,
            OP_6: 86,
            OP_7: 87,
            OP_8: 88,
            OP_9: 89,
            OP_10: 90,
            OP_11: 91,
            OP_12: 92,
            OP_13: 93,
            OP_14: 94,
            OP_15: 95,
            OP_16: 96,

            OP_NOP: 97,
            OP_VER: 98,
            OP_IF: 99,
            OP_NOTIF: 100,
            OP_VERIF: 101,
            OP_VERNOTIF: 102,
            OP_ELSE: 103,
            OP_ENDIF: 104,
            OP_VERIFY: 105,
            OP_RETURN: 106,

            OP_TOALTSTACK: 107,
            OP_FROMALTSTACK: 108,
            OP_2DROP: 109,
            OP_2DUP: 110,
            OP_3DUP: 111,
            OP_2OVER: 112,
            OP_2ROT: 113,
            OP_2SWAP: 114,
            OP_IFDUP: 115,
            OP_DEPTH: 116,
            OP_DROP: 117,
            OP_DUP: 118,
            OP_NIP: 119,
            OP_OVER: 120,
            OP_PICK: 121,
            OP_ROLL: 122,
            OP_ROT: 123,
            OP_SWAP: 124,
            OP_TUCK: 125,

            OP_CAT: 126,
            OP_SUBSTR: 127,
            OP_LEFT: 128,
            OP_RIGHT: 129,
            OP_SIZE: 130,

            OP_INVERT: 131,
            OP_AND: 132,
            OP_OR: 133,
            OP_XOR: 134,
            OP_EQUAL: 135,
            OP_EQUALVERIFY: 136,
            OP_RESERVED1: 137,
            OP_RESERVED2: 138,

            OP_1ADD: 139,
            OP_1SUB: 140,
            OP_2MUL: 141,
            OP_2DIV: 142,
            OP_NEGATE: 143,
            OP_ABS: 144,
            OP_NOT: 145,
            OP_0NOTEQUAL: 146,
            OP_ADD: 147,
            OP_SUB: 148,
            OP_MUL: 149,
            OP_DIV: 150,
            OP_MOD: 151,
            OP_LSHIFT: 152,
            OP_RSHIFT: 153,

            OP_BOOLAND: 154,
            OP_BOOLOR: 155,
            OP_NUMEQUAL: 156,
            OP_NUMEQUALVERIFY: 157,
            OP_NUMNOTEQUAL: 158,
            OP_LESSTHAN: 159,
            OP_GREATERTHAN: 160,
            OP_LESSTHANOREQUAL: 161,
            OP_GREATERTHANOREQUAL: 162,
            OP_MIN: 163,
            OP_MAX: 164,

            OP_WITHIN: 165,

            OP_RIPEMD160: 166,
            OP_SHA1: 167,
            OP_SHA256: 168,
            OP_HASH160: 169,
            OP_HASH256: 170,
            OP_CODESEPARATOR: 171,
            OP_CHECKSIG: 172,
            OP_CHECKSIGVERIFY: 173,
            OP_CHECKMULTISIG: 174,
            OP_CHECKMULTISIGVERIFY: 175,

            OP_NOP1: 176,

            OP_NOP2: 177,
            OP_CHECKLOCKTIMEVERIFY: 177,

            OP_NOP3: 178,
            OP_CHECKSEQUENCEVERIFY: 178,

            OP_NOP4: 179,
            OP_NOP5: 180,
            OP_NOP6: 181,
            OP_NOP7: 182,
            OP_NOP8: 183,
            OP_NOP9: 184,
            OP_NOP10: 185,

            OP_PUBKEYHASH: 253,
            OP_PUBKEY: 254,
            OP_INVALIDOPCODE: 255,
          };
        },
        {},
      ],
      40: [
        function (require, module, exports) {
          var OPS = require('./index.json');

          var map = {};
          for (var op in OPS) {
            var code = OPS[op];
            map[code] = op;
          }

          module.exports = map;
        },
        { './index.json': 39 },
      ],
      41: [
        function (require, module, exports) {
          var basex = require('base-x');
          var ALPHABET =
            '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

          module.exports = basex(ALPHABET);
        },
        { 'base-x': 32 },
      ],
      42: [
        function (require, module, exports) {
          'use strict';

          var base58 = require('bs58');
          var Buffer = require('safe-buffer').Buffer;

          module.exports = function (checksumFn) {
            // Encode a buffer as a base58-check encoded string
            function encode(payload) {
              var checksum = checksumFn(payload);

              return base58.encode(
                Buffer.concat([payload, checksum], payload.length + 4)
              );
            }

            function decodeRaw(buffer) {
              var payload = buffer.slice(0, -4);
              var checksum = buffer.slice(-4);
              var newChecksum = checksumFn(payload);

              if (
                (checksum[0] ^ newChecksum[0]) |
                (checksum[1] ^ newChecksum[1]) |
                (checksum[2] ^ newChecksum[2]) |
                (checksum[3] ^ newChecksum[3])
              )
                return;

              return payload;
            }

            // Decode a base58-check encoded string to a buffer, no result if checksum is wrong
            function decodeUnsafe(string) {
              var buffer = base58.decodeUnsafe(string);
              if (!buffer) return;

              return decodeRaw(buffer);
            }

            function decode(string) {
              var buffer = base58.decode(string);
              var payload = decodeRaw(buffer, checksumFn);
              if (!payload) throw new Error('Invalid checksum');
              return payload;
            }

            return {
              encode: encode,
              decode: decode,
              decodeUnsafe: decodeUnsafe,
            };
          };
        },
        { bs58: 41, 'safe-buffer': 76 },
      ],
      43: [
        function (require, module, exports) {
          'use strict';

          var createHash = require('create-hash');
          var bs58checkBase = require('./base');

          // SHA256(SHA256(buffer))
          function sha256x2(buffer) {
            var tmp = createHash('sha256').update(buffer).digest();
            return createHash('sha256').update(tmp).digest();
          }

          module.exports = bs58checkBase(sha256x2);
        },
        { './base': 42, 'create-hash': 45 },
      ],
      44: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;
          var Transform = require('stream').Transform;
          var StringDecoder = require('string_decoder').StringDecoder;
          var inherits = require('inherits');

          function CipherBase(hashMode) {
            Transform.call(this);
            this.hashMode = typeof hashMode === 'string';
            if (this.hashMode) {
              this[hashMode] = this._finalOrDigest;
            } else {
              this.final = this._finalOrDigest;
            }
            if (this._final) {
              this.__final = this._final;
              this._final = null;
            }
            this._decoder = null;
            this._encoding = null;
          }
          inherits(CipherBase, Transform);

          CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
            if (typeof data === 'string') {
              data = Buffer.from(data, inputEnc);
            }

            var outData = this._update(data);
            if (this.hashMode) return this;

            if (outputEnc) {
              outData = this._toString(outData, outputEnc);
            }

            return outData;
          };

          CipherBase.prototype.setAutoPadding = function () {};
          CipherBase.prototype.getAuthTag = function () {
            throw new Error('trying to get auth tag in unsupported state');
          };

          CipherBase.prototype.setAuthTag = function () {
            throw new Error('trying to set auth tag in unsupported state');
          };

          CipherBase.prototype.setAAD = function () {
            throw new Error('trying to set aad in unsupported state');
          };

          CipherBase.prototype._transform = function (data, _, next) {
            var err;
            try {
              if (this.hashMode) {
                this._update(data);
              } else {
                this.push(this._update(data));
              }
            } catch (e) {
              err = e;
            } finally {
              next(err);
            }
          };
          CipherBase.prototype._flush = function (done) {
            var err;
            try {
              this.push(this.__final());
            } catch (e) {
              err = e;
            }

            done(err);
          };
          CipherBase.prototype._finalOrDigest = function (outputEnc) {
            var outData = this.__final() || Buffer.alloc(0);
            if (outputEnc) {
              outData = this._toString(outData, outputEnc, true);
            }
            return outData;
          };

          CipherBase.prototype._toString = function (value, enc, fin) {
            if (!this._decoder) {
              this._decoder = new StringDecoder(enc);
              this._encoding = enc;
            }

            if (this._encoding !== enc)
              throw new Error("can't switch encodings");

            var out = this._decoder.write(value);
            if (fin) {
              out += this._decoder.end();
            }

            return out;
          };

          module.exports = CipherBase;
        },
        { inherits: 55, 'safe-buffer': 76, stream: 15, string_decoder: 30 },
      ],
      45: [
        function (require, module, exports) {
          'use strict';
          var inherits = require('inherits');
          var MD5 = require('md5.js');
          var RIPEMD160 = require('ripemd160');
          var sha = require('sha.js');
          var Base = require('cipher-base');

          function Hash(hash) {
            Base.call(this, 'digest');

            this._hash = hash;
          }

          inherits(Hash, Base);

          Hash.prototype._update = function (data) {
            this._hash.update(data);
          };

          Hash.prototype._final = function () {
            return this._hash.digest();
          };

          module.exports = function createHash(alg) {
            alg = alg.toLowerCase();
            if (alg === 'md5') return new MD5();
            if (alg === 'rmd160' || alg === 'ripemd160') return new RIPEMD160();

            return new Hash(sha(alg));
          };
        },
        {
          'cipher-base': 44,
          inherits: 55,
          'md5.js': 56,
          ripemd160: 75,
          'sha.js': 78,
        },
      ],
      46: [
        function (require, module, exports) {
          var MD5 = require('md5.js');

          module.exports = function (buffer) {
            return new MD5().update(buffer).digest();
          };
        },
        { 'md5.js': 56 },
      ],
      47: [
        function (require, module, exports) {
          'use strict';
          var inherits = require('inherits');
          var Legacy = require('./legacy');
          var Base = require('cipher-base');
          var Buffer = require('safe-buffer').Buffer;
          var md5 = require('create-hash/md5');
          var RIPEMD160 = require('ripemd160');

          var sha = require('sha.js');

          var ZEROS = Buffer.alloc(128);

          function Hmac(alg, key) {
            Base.call(this, 'digest');
            if (typeof key === 'string') {
              key = Buffer.from(key);
            }

            var blocksize = alg === 'sha512' || alg === 'sha384' ? 128 : 64;

            this._alg = alg;
            this._key = key;
            if (key.length > blocksize) {
              var hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg);
              key = hash.update(key).digest();
            } else if (key.length < blocksize) {
              key = Buffer.concat([key, ZEROS], blocksize);
            }

            var ipad = (this._ipad = Buffer.allocUnsafe(blocksize));
            var opad = (this._opad = Buffer.allocUnsafe(blocksize));

            for (var i = 0; i < blocksize; i++) {
              ipad[i] = key[i] ^ 0x36;
              opad[i] = key[i] ^ 0x5c;
            }
            this._hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg);
            this._hash.update(ipad);
          }

          inherits(Hmac, Base);

          Hmac.prototype._update = function (data) {
            this._hash.update(data);
          };

          Hmac.prototype._final = function () {
            var h = this._hash.digest();
            var hash =
              this._alg === 'rmd160' ? new RIPEMD160() : sha(this._alg);
            return hash.update(this._opad).update(h).digest();
          };

          module.exports = function createHmac(alg, key) {
            alg = alg.toLowerCase();
            if (alg === 'rmd160' || alg === 'ripemd160') {
              return new Hmac('rmd160', key);
            }
            if (alg === 'md5') {
              return new Legacy(md5, key);
            }
            return new Hmac(alg, key);
          };
        },
        {
          './legacy': 48,
          'cipher-base': 44,
          'create-hash/md5': 46,
          inherits: 55,
          ripemd160: 75,
          'safe-buffer': 76,
          'sha.js': 78,
        },
      ],
      48: [
        function (require, module, exports) {
          'use strict';
          var inherits = require('inherits');
          var Buffer = require('safe-buffer').Buffer;

          var Base = require('cipher-base');

          var ZEROS = Buffer.alloc(128);
          var blocksize = 64;

          function Hmac(alg, key) {
            Base.call(this, 'digest');
            if (typeof key === 'string') {
              key = Buffer.from(key);
            }

            this._alg = alg;
            this._key = key;

            if (key.length > blocksize) {
              key = alg(key);
            } else if (key.length < blocksize) {
              key = Buffer.concat([key, ZEROS], blocksize);
            }

            var ipad = (this._ipad = Buffer.allocUnsafe(blocksize));
            var opad = (this._opad = Buffer.allocUnsafe(blocksize));

            for (var i = 0; i < blocksize; i++) {
              ipad[i] = key[i] ^ 0x36;
              opad[i] = key[i] ^ 0x5c;
            }

            this._hash = [ipad];
          }

          inherits(Hmac, Base);

          Hmac.prototype._update = function (data) {
            this._hash.push(data);
          };

          Hmac.prototype._final = function () {
            var h = this._alg(Buffer.concat(this._hash));
            return this._alg(Buffer.concat([this._opad, h]));
          };
          module.exports = Hmac;
        },
        { 'cipher-base': 44, inherits: 55, 'safe-buffer': 76 },
      ],
      49: [
        function (require, module, exports) {
          var assert = require('assert');
          var BigInteger = require('bigi');

          var Point = require('./point');

          function Curve(p, a, b, Gx, Gy, n, h) {
            this.p = p;
            this.a = a;
            this.b = b;
            this.G = Point.fromAffine(this, Gx, Gy);
            this.n = n;
            this.h = h;

            this.infinity = new Point(this, null, null, BigInteger.ZERO);

            // result caching
            this.pOverFour = p.add(BigInteger.ONE).shiftRight(2);

            // determine size of p in bytes
            this.pLength = Math.floor((this.p.bitLength() + 7) / 8);
          }

          Curve.prototype.pointFromX = function (isOdd, x) {
            var alpha = x
              .pow(3)
              .add(this.a.multiply(x))
              .add(this.b)
              .mod(this.p);
            var beta = alpha.modPow(this.pOverFour, this.p); // XXX: not compatible with all curves

            var y = beta;
            if (beta.isEven() ^ !isOdd) {
              y = this.p.subtract(y); // -y % p
            }

            return Point.fromAffine(this, x, y);
          };

          Curve.prototype.isInfinity = function (Q) {
            if (Q === this.infinity) return true;

            return Q.z.signum() === 0 && Q.y.signum() !== 0;
          };

          Curve.prototype.isOnCurve = function (Q) {
            if (this.isInfinity(Q)) return true;

            var x = Q.affineX;
            var y = Q.affineY;
            var a = this.a;
            var b = this.b;
            var p = this.p;

            // Check that xQ and yQ are integers in the interval [0, p - 1]
            if (x.signum() < 0 || x.compareTo(p) >= 0) return false;
            if (y.signum() < 0 || y.compareTo(p) >= 0) return false;

            // and check that y^2 = x^3 + ax + b (mod p)
            var lhs = y.square().mod(p);
            var rhs = x.pow(3).add(a.multiply(x)).add(b).mod(p);
            return lhs.equals(rhs);
          };

          /**
           * Validate an elliptic curve point.
           *
           * See SEC 1, section 3.2.2.1: Elliptic Curve Public Key Validation Primitive
           */
          Curve.prototype.validate = function (Q) {
            // Check Q != O
            assert(!this.isInfinity(Q), 'Point is at infinity');
            assert(this.isOnCurve(Q), 'Point is not on the curve');

            // Check nQ = O (where Q is a scalar multiple of G)
            var nQ = Q.multiply(this.n);
            assert(this.isInfinity(nQ), 'Point is not a scalar multiple of G');

            return true;
          };

          module.exports = Curve;
        },
        { './point': 53, assert: 1, bigi: 36 },
      ],
      50: [
        function (require, module, exports) {
          module.exports = {
            secp128r1: {
              p: 'fffffffdffffffffffffffffffffffff',
              a: 'fffffffdfffffffffffffffffffffffc',
              b: 'e87579c11079f43dd824993c2cee5ed3',
              n: 'fffffffe0000000075a30d1b9038a115',
              h: '01',
              Gx: '161ff7528b899b2d0c28607ca52c5b86',
              Gy: 'cf5ac8395bafeb13c02da292dded7a83',
            },
            secp160k1: {
              p: 'fffffffffffffffffffffffffffffffeffffac73',
              a: '00',
              b: '07',
              n: '0100000000000000000001b8fa16dfab9aca16b6b3',
              h: '01',
              Gx: '3b4c382ce37aa192a4019e763036f4f5dd4d7ebb',
              Gy: '938cf935318fdced6bc28286531733c3f03c4fee',
            },
            secp160r1: {
              p: 'ffffffffffffffffffffffffffffffff7fffffff',
              a: 'ffffffffffffffffffffffffffffffff7ffffffc',
              b: '1c97befc54bd7a8b65acf89f81d4d4adc565fa45',
              n: '0100000000000000000001f4c8f927aed3ca752257',
              h: '01',
              Gx: '4a96b5688ef573284664698968c38bb913cbfc82',
              Gy: '23a628553168947d59dcc912042351377ac5fb32',
            },
            secp192k1: {
              p: 'fffffffffffffffffffffffffffffffffffffffeffffee37',
              a: '00',
              b: '03',
              n: 'fffffffffffffffffffffffe26f2fc170f69466a74defd8d',
              h: '01',
              Gx: 'db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d',
              Gy: '9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d',
            },
            secp192r1: {
              p: 'fffffffffffffffffffffffffffffffeffffffffffffffff',
              a: 'fffffffffffffffffffffffffffffffefffffffffffffffc',
              b: '64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1',
              n: 'ffffffffffffffffffffffff99def836146bc9b1b4d22831',
              h: '01',
              Gx: '188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012',
              Gy: '07192b95ffc8da78631011ed6b24cdd573f977a11e794811',
            },
            secp256k1: {
              p: 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
              a: '00',
              b: '07',
              n: 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
              h: '01',
              Gx: '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
              Gy: '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
            },
            secp256r1: {
              p: 'ffffffff00000001000000000000000000000000ffffffffffffffffffffffff',
              a: 'ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
              b: '5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b',
              n: 'ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551',
              h: '01',
              Gx: '6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
              Gy: '4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5',
            },
          };
        },
        {},
      ],
      51: [
        function (require, module, exports) {
          var Point = require('./point');
          var Curve = require('./curve');

          var getCurveByName = require('./names');

          module.exports = {
            Curve: Curve,
            Point: Point,
            getCurveByName: getCurveByName,
          };
        },
        { './curve': 49, './names': 52, './point': 53 },
      ],
      52: [
        function (require, module, exports) {
          var BigInteger = require('bigi');

          var curves = require('./curves.json');
          var Curve = require('./curve');

          function getCurveByName(name) {
            var curve = curves[name];
            if (!curve) return null;

            var p = new BigInteger(curve.p, 16);
            var a = new BigInteger(curve.a, 16);
            var b = new BigInteger(curve.b, 16);
            var n = new BigInteger(curve.n, 16);
            var h = new BigInteger(curve.h, 16);
            var Gx = new BigInteger(curve.Gx, 16);
            var Gy = new BigInteger(curve.Gy, 16);

            return new Curve(p, a, b, Gx, Gy, n, h);
          }

          module.exports = getCurveByName;
        },
        { './curve': 49, './curves.json': 50, bigi: 36 },
      ],
      53: [
        function (require, module, exports) {
          var assert = require('assert');
          var Buffer = require('safe-buffer').Buffer;
          var BigInteger = require('bigi');

          var THREE = BigInteger.valueOf(3);

          function Point(curve, x, y, z) {
            assert.notStrictEqual(z, undefined, 'Missing Z coordinate');

            this.curve = curve;
            this.x = x;
            this.y = y;
            this.z = z;
            this._zInv = null;

            this.compressed = true;
          }

          Object.defineProperty(Point.prototype, 'zInv', {
            get: function () {
              if (this._zInv === null) {
                this._zInv = this.z.modInverse(this.curve.p);
              }

              return this._zInv;
            },
          });

          Object.defineProperty(Point.prototype, 'affineX', {
            get: function () {
              return this.x.multiply(this.zInv).mod(this.curve.p);
            },
          });

          Object.defineProperty(Point.prototype, 'affineY', {
            get: function () {
              return this.y.multiply(this.zInv).mod(this.curve.p);
            },
          });

          Point.fromAffine = function (curve, x, y) {
            return new Point(curve, x, y, BigInteger.ONE);
          };

          Point.prototype.equals = function (other) {
            if (other === this) return true;
            if (this.curve.isInfinity(this))
              return this.curve.isInfinity(other);
            if (this.curve.isInfinity(other))
              return this.curve.isInfinity(this);

            // u = Y2 * Z1 - Y1 * Z2
            var u = other.y
              .multiply(this.z)
              .subtract(this.y.multiply(other.z))
              .mod(this.curve.p);

            if (u.signum() !== 0) return false;

            // v = X2 * Z1 - X1 * Z2
            var v = other.x
              .multiply(this.z)
              .subtract(this.x.multiply(other.z))
              .mod(this.curve.p);

            return v.signum() === 0;
          };

          Point.prototype.negate = function () {
            var y = this.curve.p.subtract(this.y);

            return new Point(this.curve, this.x, y, this.z);
          };

          Point.prototype.add = function (b) {
            if (this.curve.isInfinity(this)) return b;
            if (this.curve.isInfinity(b)) return this;

            var x1 = this.x;
            var y1 = this.y;
            var x2 = b.x;
            var y2 = b.y;

            // u = Y2 * Z1 - Y1 * Z2
            var u = y2
              .multiply(this.z)
              .subtract(y1.multiply(b.z))
              .mod(this.curve.p);
            // v = X2 * Z1 - X1 * Z2
            var v = x2
              .multiply(this.z)
              .subtract(x1.multiply(b.z))
              .mod(this.curve.p);

            if (v.signum() === 0) {
              if (u.signum() === 0) {
                return this.twice(); // this == b, so double
              }

              return this.curve.infinity; // this = -b, so infinity
            }

            var v2 = v.square();
            var v3 = v2.multiply(v);
            var x1v2 = x1.multiply(v2);
            var zu2 = u.square().multiply(this.z);

            // x3 = v * (z2 * (z1 * u^2 - 2 * x1 * v^2) - v^3)
            var x3 = zu2
              .subtract(x1v2.shiftLeft(1))
              .multiply(b.z)
              .subtract(v3)
              .multiply(v)
              .mod(this.curve.p);
            // y3 = z2 * (3 * x1 * u * v^2 - y1 * v^3 - z1 * u^3) + u * v^3
            var y3 = x1v2
              .multiply(THREE)
              .multiply(u)
              .subtract(y1.multiply(v3))
              .subtract(zu2.multiply(u))
              .multiply(b.z)
              .add(u.multiply(v3))
              .mod(this.curve.p);
            // z3 = v^3 * z1 * z2
            var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.p);

            return new Point(this.curve, x3, y3, z3);
          };

          Point.prototype.twice = function () {
            if (this.curve.isInfinity(this)) return this;
            if (this.y.signum() === 0) return this.curve.infinity;

            var x1 = this.x;
            var y1 = this.y;

            var y1z1 = y1.multiply(this.z).mod(this.curve.p);
            var y1sqz1 = y1z1.multiply(y1).mod(this.curve.p);
            var a = this.curve.a;

            // w = 3 * x1^2 + a * z1^2
            var w = x1.square().multiply(THREE);

            if (a.signum() !== 0) {
              w = w.add(this.z.square().multiply(a));
            }

            w = w.mod(this.curve.p);
            // x3 = 2 * y1 * z1 * (w^2 - 8 * x1 * y1^2 * z1)
            var x3 = w
              .square()
              .subtract(x1.shiftLeft(3).multiply(y1sqz1))
              .shiftLeft(1)
              .multiply(y1z1)
              .mod(this.curve.p);
            // y3 = 4 * y1^2 * z1 * (3 * w * x1 - 2 * y1^2 * z1) - w^3
            var y3 = w
              .multiply(THREE)
              .multiply(x1)
              .subtract(y1sqz1.shiftLeft(1))
              .shiftLeft(2)
              .multiply(y1sqz1)
              .subtract(w.pow(3))
              .mod(this.curve.p);
            // z3 = 8 * (y1 * z1)^3
            var z3 = y1z1.pow(3).shiftLeft(3).mod(this.curve.p);

            return new Point(this.curve, x3, y3, z3);
          };

          // Simple NAF (Non-Adjacent Form) multiplication algorithm
          // TODO: modularize the multiplication algorithm
          Point.prototype.multiply = function (k) {
            if (this.curve.isInfinity(this)) return this;
            if (k.signum() === 0) return this.curve.infinity;

            var e = k;
            var h = e.multiply(THREE);

            var neg = this.negate();
            var R = this;

            for (var i = h.bitLength() - 2; i > 0; --i) {
              var hBit = h.testBit(i);
              var eBit = e.testBit(i);

              R = R.twice();

              if (hBit !== eBit) {
                R = R.add(hBit ? this : neg);
              }
            }

            return R;
          };

          // Compute this*j + x*k (simultaneous multiplication)
          Point.prototype.multiplyTwo = function (j, x, k) {
            var i = Math.max(j.bitLength(), k.bitLength()) - 1;
            var R = this.curve.infinity;
            var both = this.add(x);

            while (i >= 0) {
              var jBit = j.testBit(i);
              var kBit = k.testBit(i);

              R = R.twice();

              if (jBit) {
                if (kBit) {
                  R = R.add(both);
                } else {
                  R = R.add(this);
                }
              } else if (kBit) {
                R = R.add(x);
              }
              --i;
            }

            return R;
          };

          Point.prototype.getEncoded = function (compressed) {
            if (compressed == null) compressed = this.compressed;
            if (this.curve.isInfinity(this)) return Buffer.alloc(1, 0); // Infinity point encoded is simply '00'

            var x = this.affineX;
            var y = this.affineY;
            var byteLength = this.curve.pLength;
            var buffer;

            // 0x02/0x03 | X
            if (compressed) {
              buffer = Buffer.allocUnsafe(1 + byteLength);
              buffer.writeUInt8(y.isEven() ? 0x02 : 0x03, 0);

              // 0x04 | X | Y
            } else {
              buffer = Buffer.allocUnsafe(1 + byteLength + byteLength);
              buffer.writeUInt8(0x04, 0);

              y.toBuffer(byteLength).copy(buffer, 1 + byteLength);
            }

            x.toBuffer(byteLength).copy(buffer, 1);

            return buffer;
          };

          Point.decodeFrom = function (curve, buffer) {
            var type = buffer.readUInt8(0);
            var compressed = type !== 4;

            var byteLength = Math.floor((curve.p.bitLength() + 7) / 8);
            var x = BigInteger.fromBuffer(buffer.slice(1, 1 + byteLength));

            var Q;
            if (compressed) {
              assert.equal(
                buffer.length,
                byteLength + 1,
                'Invalid sequence length'
              );
              assert(type === 0x02 || type === 0x03, 'Invalid sequence tag');

              var isOdd = type === 0x03;
              Q = curve.pointFromX(isOdd, x);
            } else {
              assert.equal(
                buffer.length,
                1 + byteLength + byteLength,
                'Invalid sequence length'
              );

              var y = BigInteger.fromBuffer(buffer.slice(1 + byteLength));
              Q = Point.fromAffine(curve, x, y);
            }

            Q.compressed = compressed;
            return Q;
          };

          Point.prototype.toString = function () {
            if (this.curve.isInfinity(this)) return '(INFINITY)';

            return (
              '(' +
              this.affineX.toString() +
              ',' +
              this.affineY.toString() +
              ')'
            );
          };

          module.exports = Point;
        },
        { assert: 1, bigi: 36, 'safe-buffer': 76 },
      ],
      54: [
        function (require, module, exports) {
          'use strict';
          var Buffer = require('safe-buffer').Buffer;
          var Transform = require('readable-stream').Transform;
          var inherits = require('inherits');

          function throwIfNotStringOrBuffer(val, prefix) {
            if (!Buffer.isBuffer(val) && typeof val !== 'string') {
              throw new TypeError(prefix + ' must be a string or a buffer');
            }
          }

          function HashBase(blockSize) {
            Transform.call(this);

            this._block = Buffer.allocUnsafe(blockSize);
            this._blockSize = blockSize;
            this._blockOffset = 0;
            this._length = [0, 0, 0, 0];

            this._finalized = false;
          }

          inherits(HashBase, Transform);

          HashBase.prototype._transform = function (chunk, encoding, callback) {
            var error = null;
            try {
              this.update(chunk, encoding);
            } catch (err) {
              error = err;
            }

            callback(error);
          };

          HashBase.prototype._flush = function (callback) {
            var error = null;
            try {
              this.push(this.digest());
            } catch (err) {
              error = err;
            }

            callback(error);
          };

          HashBase.prototype.update = function (data, encoding) {
            throwIfNotStringOrBuffer(data, 'Data');
            if (this._finalized) throw new Error('Digest already called');
            if (!Buffer.isBuffer(data)) data = Buffer.from(data, encoding);

            // consume data
            var block = this._block;
            var offset = 0;
            while (
              this._blockOffset + data.length - offset >=
              this._blockSize
            ) {
              for (var i = this._blockOffset; i < this._blockSize; )
                block[i++] = data[offset++];
              this._update();
              this._blockOffset = 0;
            }
            while (offset < data.length)
              block[this._blockOffset++] = data[offset++];

            // update length
            for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
              this._length[j] += carry;
              carry = (this._length[j] / 0x0100000000) | 0;
              if (carry > 0) this._length[j] -= 0x0100000000 * carry;
            }

            return this;
          };

          HashBase.prototype._update = function () {
            throw new Error('_update is not implemented');
          };

          HashBase.prototype.digest = function (encoding) {
            if (this._finalized) throw new Error('Digest already called');
            this._finalized = true;

            var digest = this._digest();
            if (encoding !== undefined) digest = digest.toString(encoding);

            // reset state
            this._block.fill(0);
            this._blockOffset = 0;
            for (var i = 0; i < 4; ++i) this._length[i] = 0;

            return digest;
          };

          HashBase.prototype._digest = function () {
            throw new Error('_digest is not implemented');
          };

          module.exports = HashBase;
        },
        { inherits: 55, 'readable-stream': 74, 'safe-buffer': 76 },
      ],
      55: [
        function (require, module, exports) {
          arguments[4][10][0].apply(exports, arguments);
        },
        { dup: 10 },
      ],
      56: [
        function (require, module, exports) {
          'use strict';
          var inherits = require('inherits');
          var HashBase = require('hash-base');
          var Buffer = require('safe-buffer').Buffer;

          var ARRAY16 = new Array(16);

          function MD5() {
            HashBase.call(this, 64);

            // state
            this._a = 0x67452301;
            this._b = 0xefcdab89;
            this._c = 0x98badcfe;
            this._d = 0x10325476;
          }

          inherits(MD5, HashBase);

          MD5.prototype._update = function () {
            var M = ARRAY16;
            for (var i = 0; i < 16; ++i) M[i] = this._block.readInt32LE(i * 4);

            var a = this._a;
            var b = this._b;
            var c = this._c;
            var d = this._d;

            a = fnF(a, b, c, d, M[0], 0xd76aa478, 7);
            d = fnF(d, a, b, c, M[1], 0xe8c7b756, 12);
            c = fnF(c, d, a, b, M[2], 0x242070db, 17);
            b = fnF(b, c, d, a, M[3], 0xc1bdceee, 22);
            a = fnF(a, b, c, d, M[4], 0xf57c0faf, 7);
            d = fnF(d, a, b, c, M[5], 0x4787c62a, 12);
            c = fnF(c, d, a, b, M[6], 0xa8304613, 17);
            b = fnF(b, c, d, a, M[7], 0xfd469501, 22);
            a = fnF(a, b, c, d, M[8], 0x698098d8, 7);
            d = fnF(d, a, b, c, M[9], 0x8b44f7af, 12);
            c = fnF(c, d, a, b, M[10], 0xffff5bb1, 17);
            b = fnF(b, c, d, a, M[11], 0x895cd7be, 22);
            a = fnF(a, b, c, d, M[12], 0x6b901122, 7);
            d = fnF(d, a, b, c, M[13], 0xfd987193, 12);
            c = fnF(c, d, a, b, M[14], 0xa679438e, 17);
            b = fnF(b, c, d, a, M[15], 0x49b40821, 22);

            a = fnG(a, b, c, d, M[1], 0xf61e2562, 5);
            d = fnG(d, a, b, c, M[6], 0xc040b340, 9);
            c = fnG(c, d, a, b, M[11], 0x265e5a51, 14);
            b = fnG(b, c, d, a, M[0], 0xe9b6c7aa, 20);
            a = fnG(a, b, c, d, M[5], 0xd62f105d, 5);
            d = fnG(d, a, b, c, M[10], 0x02441453, 9);
            c = fnG(c, d, a, b, M[15], 0xd8a1e681, 14);
            b = fnG(b, c, d, a, M[4], 0xe7d3fbc8, 20);
            a = fnG(a, b, c, d, M[9], 0x21e1cde6, 5);
            d = fnG(d, a, b, c, M[14], 0xc33707d6, 9);
            c = fnG(c, d, a, b, M[3], 0xf4d50d87, 14);
            b = fnG(b, c, d, a, M[8], 0x455a14ed, 20);
            a = fnG(a, b, c, d, M[13], 0xa9e3e905, 5);
            d = fnG(d, a, b, c, M[2], 0xfcefa3f8, 9);
            c = fnG(c, d, a, b, M[7], 0x676f02d9, 14);
            b = fnG(b, c, d, a, M[12], 0x8d2a4c8a, 20);

            a = fnH(a, b, c, d, M[5], 0xfffa3942, 4);
            d = fnH(d, a, b, c, M[8], 0x8771f681, 11);
            c = fnH(c, d, a, b, M[11], 0x6d9d6122, 16);
            b = fnH(b, c, d, a, M[14], 0xfde5380c, 23);
            a = fnH(a, b, c, d, M[1], 0xa4beea44, 4);
            d = fnH(d, a, b, c, M[4], 0x4bdecfa9, 11);
            c = fnH(c, d, a, b, M[7], 0xf6bb4b60, 16);
            b = fnH(b, c, d, a, M[10], 0xbebfbc70, 23);
            a = fnH(a, b, c, d, M[13], 0x289b7ec6, 4);
            d = fnH(d, a, b, c, M[0], 0xeaa127fa, 11);
            c = fnH(c, d, a, b, M[3], 0xd4ef3085, 16);
            b = fnH(b, c, d, a, M[6], 0x04881d05, 23);
            a = fnH(a, b, c, d, M[9], 0xd9d4d039, 4);
            d = fnH(d, a, b, c, M[12], 0xe6db99e5, 11);
            c = fnH(c, d, a, b, M[15], 0x1fa27cf8, 16);
            b = fnH(b, c, d, a, M[2], 0xc4ac5665, 23);

            a = fnI(a, b, c, d, M[0], 0xf4292244, 6);
            d = fnI(d, a, b, c, M[7], 0x432aff97, 10);
            c = fnI(c, d, a, b, M[14], 0xab9423a7, 15);
            b = fnI(b, c, d, a, M[5], 0xfc93a039, 21);
            a = fnI(a, b, c, d, M[12], 0x655b59c3, 6);
            d = fnI(d, a, b, c, M[3], 0x8f0ccc92, 10);
            c = fnI(c, d, a, b, M[10], 0xffeff47d, 15);
            b = fnI(b, c, d, a, M[1], 0x85845dd1, 21);
            a = fnI(a, b, c, d, M[8], 0x6fa87e4f, 6);
            d = fnI(d, a, b, c, M[15], 0xfe2ce6e0, 10);
            c = fnI(c, d, a, b, M[6], 0xa3014314, 15);
            b = fnI(b, c, d, a, M[13], 0x4e0811a1, 21);
            a = fnI(a, b, c, d, M[4], 0xf7537e82, 6);
            d = fnI(d, a, b, c, M[11], 0xbd3af235, 10);
            c = fnI(c, d, a, b, M[2], 0x2ad7d2bb, 15);
            b = fnI(b, c, d, a, M[9], 0xeb86d391, 21);

            this._a = (this._a + a) | 0;
            this._b = (this._b + b) | 0;
            this._c = (this._c + c) | 0;
            this._d = (this._d + d) | 0;
          };

          MD5.prototype._digest = function () {
            // create padding and handle blocks
            this._block[this._blockOffset++] = 0x80;
            if (this._blockOffset > 56) {
              this._block.fill(0, this._blockOffset, 64);
              this._update();
              this._blockOffset = 0;
            }

            this._block.fill(0, this._blockOffset, 56);
            this._block.writeUInt32LE(this._length[0], 56);
            this._block.writeUInt32LE(this._length[1], 60);
            this._update();

            // produce result
            var buffer = Buffer.allocUnsafe(16);
            buffer.writeInt32LE(this._a, 0);
            buffer.writeInt32LE(this._b, 4);
            buffer.writeInt32LE(this._c, 8);
            buffer.writeInt32LE(this._d, 12);
            return buffer;
          };

          function rotl(x, n) {
            return (x << n) | (x >>> (32 - n));
          }

          function fnF(a, b, c, d, m, k, s) {
            return (rotl((a + ((b & c) | (~b & d)) + m + k) | 0, s) + b) | 0;
          }

          function fnG(a, b, c, d, m, k, s) {
            return (rotl((a + ((b & d) | (c & ~d)) + m + k) | 0, s) + b) | 0;
          }

          function fnH(a, b, c, d, m, k, s) {
            return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + b) | 0;
          }

          function fnI(a, b, c, d, m, k, s) {
            return (rotl((a + (c ^ (b | ~d)) + m + k) | 0, s) + b) | 0;
          }

          module.exports = MD5;
        },
        { 'hash-base': 54, inherits: 55, 'safe-buffer': 76 },
      ],
      57: [
        function (require, module, exports) {
          (function (Buffer) {
            (function () {
              // constant-space merkle root calculation algorithm
              module.exports = function fastRoot(values, digestFn) {
                if (!Array.isArray(values))
                  throw TypeError('Expected values Array');
                if (typeof digestFn !== 'function')
                  throw TypeError('Expected digest Function');

                var length = values.length;
                var results = values.concat();

                while (length > 1) {
                  var j = 0;

                  for (var i = 0; i < length; i += 2, ++j) {
                    var left = results[i];
                    var right = i + 1 === length ? left : results[i + 1];
                    var data = Buffer.concat([left, right]);

                    results[j] = digestFn(data);
                  }

                  length = j;
                }

                return results[0];
              };
            }.call(this));
          }.call(this, require('buffer').Buffer));
        },
        { buffer: 7 },
      ],
      58: [
        function (require, module, exports) {
          var OPS = require('bitcoin-ops');

          function encodingLength(i) {
            return i < OPS.OP_PUSHDATA1
              ? 1
              : i <= 0xff
              ? 2
              : i <= 0xffff
              ? 3
              : 5;
          }

          function encode(buffer, number, offset) {
            var size = encodingLength(number);

            // ~6 bit
            if (size === 1) {
              buffer.writeUInt8(number, offset);

              // 8 bit
            } else if (size === 2) {
              buffer.writeUInt8(OPS.OP_PUSHDATA1, offset);
              buffer.writeUInt8(number, offset + 1);

              // 16 bit
            } else if (size === 3) {
              buffer.writeUInt8(OPS.OP_PUSHDATA2, offset);
              buffer.writeUInt16LE(number, offset + 1);

              // 32 bit
            } else {
              buffer.writeUInt8(OPS.OP_PUSHDATA4, offset);
              buffer.writeUInt32LE(number, offset + 1);
            }

            return size;
          }

          function decode(buffer, offset) {
            var opcode = buffer.readUInt8(offset);
            var number, size;

            // ~6 bit
            if (opcode < OPS.OP_PUSHDATA1) {
              number = opcode;
              size = 1;

              // 8 bit
            } else if (opcode === OPS.OP_PUSHDATA1) {
              if (offset + 2 > buffer.length) return null;
              number = buffer.readUInt8(offset + 1);
              size = 2;

              // 16 bit
            } else if (opcode === OPS.OP_PUSHDATA2) {
              if (offset + 3 > buffer.length) return null;
              number = buffer.readUInt16LE(offset + 1);
              size = 3;

              // 32 bit
            } else {
              if (offset + 5 > buffer.length) return null;
              if (opcode !== OPS.OP_PUSHDATA4)
                throw new Error('Unexpected opcode');

              number = buffer.readUInt32LE(offset + 1);
              size = 5;
            }

            return {
              opcode: opcode,
              number: number,
              size: size,
            };
          }

          module.exports = {
            encodingLength: encodingLength,
            encode: encode,
            decode: decode,
          };
        },
        { 'bitcoin-ops': 39 },
      ],
      59: [
        function (require, module, exports) {
          (function (process, global) {
            (function () {
              'use strict';

              // limit of Crypto.getRandomValues()
              // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
              var MAX_BYTES = 65536;

              // Node supports requesting up to this number of bytes
              // https://github.com/nodejs/node/blob/master/lib/internal/crypto/random.js#L48
              var MAX_UINT32 = 4294967295;

              function oldBrowser() {
                throw new Error(
                  'Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11'
                );
              }

              var Buffer = require('safe-buffer').Buffer;
              var crypto = global.crypto || global.msCrypto;

              if (crypto && crypto.getRandomValues) {
                module.exports = randomBytes;
              } else {
                module.exports = oldBrowser;
              }

              function randomBytes(size, cb) {
                // phantomjs needs to throw
                if (size > MAX_UINT32)
                  throw new RangeError('requested too many random bytes');

                var bytes = Buffer.allocUnsafe(size);

                if (size > 0) {
                  // getRandomValues fails on IE if size == 0
                  if (size > MAX_BYTES) {
                    // this is the max bytes crypto.getRandomValues
                    // can do at once see https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
                    for (
                      var generated = 0;
                      generated < size;
                      generated += MAX_BYTES
                    ) {
                      // buffer.slice automatically checks if the end is past the end of
                      // the buffer so we don't have to here
                      crypto.getRandomValues(
                        bytes.slice(generated, generated + MAX_BYTES)
                      );
                    }
                  } else {
                    crypto.getRandomValues(bytes);
                  }
                }

                if (typeof cb === 'function') {
                  return process.nextTick(function () {
                    cb(null, bytes);
                  });
                }

                return bytes;
              }
            }.call(this));
          }.call(
            this,
            require('_process'),
            typeof global !== 'undefined'
              ? global
              : typeof self !== 'undefined'
              ? self
              : typeof window !== 'undefined'
              ? window
              : {}
          ));
        },
        { _process: 13, 'safe-buffer': 76 },
      ],
      60: [
        function (require, module, exports) {
          arguments[4][16][0].apply(exports, arguments);
        },
        { dup: 16 },
      ],
      61: [
        function (require, module, exports) {
          arguments[4][17][0].apply(exports, arguments);
        },
        {
          './_stream_readable': 63,
          './_stream_writable': 65,
          _process: 13,
          dup: 17,
          inherits: 55,
        },
      ],
      62: [
        function (require, module, exports) {
          arguments[4][18][0].apply(exports, arguments);
        },
        { './_stream_transform': 64, dup: 18, inherits: 55 },
      ],
      63: [
        function (require, module, exports) {
          arguments[4][19][0].apply(exports, arguments);
        },
        {
          '../errors': 60,
          './_stream_duplex': 61,
          './internal/streams/async_iterator': 66,
          './internal/streams/buffer_list': 67,
          './internal/streams/destroy': 68,
          './internal/streams/from': 70,
          './internal/streams/state': 72,
          './internal/streams/stream': 73,
          _process: 13,
          buffer: 7,
          dup: 19,
          events: 8,
          inherits: 55,
          'string_decoder/': 85,
          util: 6,
        },
      ],
      64: [
        function (require, module, exports) {
          arguments[4][20][0].apply(exports, arguments);
        },
        { '../errors': 60, './_stream_duplex': 61, dup: 20, inherits: 55 },
      ],
      65: [
        function (require, module, exports) {
          arguments[4][21][0].apply(exports, arguments);
        },
        {
          '../errors': 60,
          './_stream_duplex': 61,
          './internal/streams/destroy': 68,
          './internal/streams/state': 72,
          './internal/streams/stream': 73,
          _process: 13,
          buffer: 7,
          dup: 21,
          inherits: 55,
          'util-deprecate': 90,
        },
      ],
      66: [
        function (require, module, exports) {
          arguments[4][22][0].apply(exports, arguments);
        },
        { './end-of-stream': 69, _process: 13, dup: 22 },
      ],
      67: [
        function (require, module, exports) {
          arguments[4][23][0].apply(exports, arguments);
        },
        { buffer: 7, dup: 23, util: 6 },
      ],
      68: [
        function (require, module, exports) {
          arguments[4][24][0].apply(exports, arguments);
        },
        { _process: 13, dup: 24 },
      ],
      69: [
        function (require, module, exports) {
          arguments[4][25][0].apply(exports, arguments);
        },
        { '../../../errors': 60, dup: 25 },
      ],
      70: [
        function (require, module, exports) {
          arguments[4][26][0].apply(exports, arguments);
        },
        { dup: 26 },
      ],
      71: [
        function (require, module, exports) {
          arguments[4][27][0].apply(exports, arguments);
        },
        { '../../../errors': 60, './end-of-stream': 69, dup: 27 },
      ],
      72: [
        function (require, module, exports) {
          arguments[4][28][0].apply(exports, arguments);
        },
        { '../../../errors': 60, dup: 28 },
      ],
      73: [
        function (require, module, exports) {
          arguments[4][29][0].apply(exports, arguments);
        },
        { dup: 29, events: 8 },
      ],
      74: [
        function (require, module, exports) {
          exports = module.exports = require('./lib/_stream_readable.js');
          exports.Stream = exports;
          exports.Readable = exports;
          exports.Writable = require('./lib/_stream_writable.js');
          exports.Duplex = require('./lib/_stream_duplex.js');
          exports.Transform = require('./lib/_stream_transform.js');
          exports.PassThrough = require('./lib/_stream_passthrough.js');
          exports.finished = require('./lib/internal/streams/end-of-stream.js');
          exports.pipeline = require('./lib/internal/streams/pipeline.js');
        },
        {
          './lib/_stream_duplex.js': 61,
          './lib/_stream_passthrough.js': 62,
          './lib/_stream_readable.js': 63,
          './lib/_stream_transform.js': 64,
          './lib/_stream_writable.js': 65,
          './lib/internal/streams/end-of-stream.js': 69,
          './lib/internal/streams/pipeline.js': 71,
        },
      ],
      75: [
        function (require, module, exports) {
          'use strict';
          var Buffer = require('buffer').Buffer;
          var inherits = require('inherits');
          var HashBase = require('hash-base');

          var ARRAY16 = new Array(16);

          var zl = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1,
            10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1,
            2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15,
            14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
          ];

          var zr = [
            5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7,
            0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9,
            11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13,
            9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
          ];

          var sl = [
            11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13,
            11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13,
            15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14,
            5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8,
            5, 6,
          ];

          var sr = [
            8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15,
            7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6,
            14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9,
            12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13,
            11, 11,
          ];

          var hl = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
          var hr = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];

          function RIPEMD160() {
            HashBase.call(this, 64);

            // state
            this._a = 0x67452301;
            this._b = 0xefcdab89;
            this._c = 0x98badcfe;
            this._d = 0x10325476;
            this._e = 0xc3d2e1f0;
          }

          inherits(RIPEMD160, HashBase);

          RIPEMD160.prototype._update = function () {
            var words = ARRAY16;
            for (var j = 0; j < 16; ++j)
              words[j] = this._block.readInt32LE(j * 4);

            var al = this._a | 0;
            var bl = this._b | 0;
            var cl = this._c | 0;
            var dl = this._d | 0;
            var el = this._e | 0;

            var ar = this._a | 0;
            var br = this._b | 0;
            var cr = this._c | 0;
            var dr = this._d | 0;
            var er = this._e | 0;

            // computation
            for (var i = 0; i < 80; i += 1) {
              var tl;
              var tr;
              if (i < 16) {
                tl = fn1(al, bl, cl, dl, el, words[zl[i]], hl[0], sl[i]);
                tr = fn5(ar, br, cr, dr, er, words[zr[i]], hr[0], sr[i]);
              } else if (i < 32) {
                tl = fn2(al, bl, cl, dl, el, words[zl[i]], hl[1], sl[i]);
                tr = fn4(ar, br, cr, dr, er, words[zr[i]], hr[1], sr[i]);
              } else if (i < 48) {
                tl = fn3(al, bl, cl, dl, el, words[zl[i]], hl[2], sl[i]);
                tr = fn3(ar, br, cr, dr, er, words[zr[i]], hr[2], sr[i]);
              } else if (i < 64) {
                tl = fn4(al, bl, cl, dl, el, words[zl[i]], hl[3], sl[i]);
                tr = fn2(ar, br, cr, dr, er, words[zr[i]], hr[3], sr[i]);
              } else {
                // if (i<80) {
                tl = fn5(al, bl, cl, dl, el, words[zl[i]], hl[4], sl[i]);
                tr = fn1(ar, br, cr, dr, er, words[zr[i]], hr[4], sr[i]);
              }

              al = el;
              el = dl;
              dl = rotl(cl, 10);
              cl = bl;
              bl = tl;

              ar = er;
              er = dr;
              dr = rotl(cr, 10);
              cr = br;
              br = tr;
            }

            // update state
            var t = (this._b + cl + dr) | 0;
            this._b = (this._c + dl + er) | 0;
            this._c = (this._d + el + ar) | 0;
            this._d = (this._e + al + br) | 0;
            this._e = (this._a + bl + cr) | 0;
            this._a = t;
          };

          RIPEMD160.prototype._digest = function () {
            // create padding and handle blocks
            this._block[this._blockOffset++] = 0x80;
            if (this._blockOffset > 56) {
              this._block.fill(0, this._blockOffset, 64);
              this._update();
              this._blockOffset = 0;
            }

            this._block.fill(0, this._blockOffset, 56);
            this._block.writeUInt32LE(this._length[0], 56);
            this._block.writeUInt32LE(this._length[1], 60);
            this._update();

            // produce result
            var buffer = Buffer.alloc ? Buffer.alloc(20) : new Buffer(20);
            buffer.writeInt32LE(this._a, 0);
            buffer.writeInt32LE(this._b, 4);
            buffer.writeInt32LE(this._c, 8);
            buffer.writeInt32LE(this._d, 12);
            buffer.writeInt32LE(this._e, 16);
            return buffer;
          };

          function rotl(x, n) {
            return (x << n) | (x >>> (32 - n));
          }

          function fn1(a, b, c, d, e, m, k, s) {
            return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0;
          }

          function fn2(a, b, c, d, e, m, k, s) {
            return (rotl((a + ((b & c) | (~b & d)) + m + k) | 0, s) + e) | 0;
          }

          function fn3(a, b, c, d, e, m, k, s) {
            return (rotl((a + ((b | ~c) ^ d) + m + k) | 0, s) + e) | 0;
          }

          function fn4(a, b, c, d, e, m, k, s) {
            return (rotl((a + ((b & d) | (c & ~d)) + m + k) | 0, s) + e) | 0;
          }

          function fn5(a, b, c, d, e, m, k, s) {
            return (rotl((a + (b ^ (c | ~d)) + m + k) | 0, s) + e) | 0;
          }

          module.exports = RIPEMD160;
        },
        { buffer: 7, 'hash-base': 54, inherits: 55 },
      ],
      76: [
        function (require, module, exports) {
          arguments[4][14][0].apply(exports, arguments);
        },
        { buffer: 7, dup: 14 },
      ],
      77: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;

          // prototype class for hash functions
          function Hash(blockSize, finalSize) {
            this._block = Buffer.alloc(blockSize);
            this._finalSize = finalSize;
            this._blockSize = blockSize;
            this._len = 0;
          }

          Hash.prototype.update = function (data, enc) {
            if (typeof data === 'string') {
              enc = enc || 'utf8';
              data = Buffer.from(data, enc);
            }

            var block = this._block;
            var blockSize = this._blockSize;
            var length = data.length;
            var accum = this._len;

            for (var offset = 0; offset < length; ) {
              var assigned = accum % blockSize;
              var remainder = Math.min(length - offset, blockSize - assigned);

              for (var i = 0; i < remainder; i++) {
                block[assigned + i] = data[offset + i];
              }

              accum += remainder;
              offset += remainder;

              if (accum % blockSize === 0) {
                this._update(block);
              }
            }

            this._len += length;
            return this;
          };

          Hash.prototype.digest = function (enc) {
            var rem = this._len % this._blockSize;

            this._block[rem] = 0x80;

            // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
            // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
            this._block.fill(0, rem + 1);

            if (rem >= this._finalSize) {
              this._update(this._block);
              this._block.fill(0);
            }

            var bits = this._len * 8;

            // uint32
            if (bits <= 0xffffffff) {
              this._block.writeUInt32BE(bits, this._blockSize - 4);

              // uint64
            } else {
              var lowBits = (bits & 0xffffffff) >>> 0;
              var highBits = (bits - lowBits) / 0x100000000;

              this._block.writeUInt32BE(highBits, this._blockSize - 8);
              this._block.writeUInt32BE(lowBits, this._blockSize - 4);
            }

            this._update(this._block);
            var hash = this._hash();

            return enc ? hash.toString(enc) : hash;
          };

          Hash.prototype._update = function () {
            throw new Error('_update must be implemented by subclass');
          };

          module.exports = Hash;
        },
        { 'safe-buffer': 76 },
      ],
      78: [
        function (require, module, exports) {
          var exports = (module.exports = function SHA(algorithm) {
            algorithm = algorithm.toLowerCase();

            var Algorithm = exports[algorithm];
            if (!Algorithm)
              throw new Error(
                algorithm + ' is not supported (we accept pull requests)'
              );

            return new Algorithm();
          });

          exports.sha = require('./sha');
          exports.sha1 = require('./sha1');
          exports.sha224 = require('./sha224');
          exports.sha256 = require('./sha256');
          exports.sha384 = require('./sha384');
          exports.sha512 = require('./sha512');
        },
        {
          './sha': 79,
          './sha1': 80,
          './sha224': 81,
          './sha256': 82,
          './sha384': 83,
          './sha512': 84,
        },
      ],
      79: [
        function (require, module, exports) {
          /*
           * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
           * in FIPS PUB 180-1
           * This source code is derived from sha1.js of the same repository.
           * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
           * operation was added.
           */

          var inherits = require('inherits');
          var Hash = require('./hash');
          var Buffer = require('safe-buffer').Buffer;

          var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0];

          var W = new Array(80);

          function Sha() {
            this.init();
            this._w = W;

            Hash.call(this, 64, 56);
          }

          inherits(Sha, Hash);

          Sha.prototype.init = function () {
            this._a = 0x67452301;
            this._b = 0xefcdab89;
            this._c = 0x98badcfe;
            this._d = 0x10325476;
            this._e = 0xc3d2e1f0;

            return this;
          };

          function rotl5(num) {
            return (num << 5) | (num >>> 27);
          }

          function rotl30(num) {
            return (num << 30) | (num >>> 2);
          }

          function ft(s, b, c, d) {
            if (s === 0) return (b & c) | (~b & d);
            if (s === 2) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
          }

          Sha.prototype._update = function (M) {
            var W = this._w;

            var a = this._a | 0;
            var b = this._b | 0;
            var c = this._c | 0;
            var d = this._d | 0;
            var e = this._e | 0;

            for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
            for (; i < 80; ++i)
              W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];

            for (var j = 0; j < 80; ++j) {
              var s = ~~(j / 20);
              var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0;

              e = d;
              d = c;
              c = rotl30(b);
              b = a;
              a = t;
            }

            this._a = (a + this._a) | 0;
            this._b = (b + this._b) | 0;
            this._c = (c + this._c) | 0;
            this._d = (d + this._d) | 0;
            this._e = (e + this._e) | 0;
          };

          Sha.prototype._hash = function () {
            var H = Buffer.allocUnsafe(20);

            H.writeInt32BE(this._a | 0, 0);
            H.writeInt32BE(this._b | 0, 4);
            H.writeInt32BE(this._c | 0, 8);
            H.writeInt32BE(this._d | 0, 12);
            H.writeInt32BE(this._e | 0, 16);

            return H;
          };

          module.exports = Sha;
        },
        { './hash': 77, inherits: 55, 'safe-buffer': 76 },
      ],
      80: [
        function (require, module, exports) {
          /*
           * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
           * in FIPS PUB 180-1
           * Version 2.1a Copyright Paul Johnston 2000 - 2002.
           * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
           * Distributed under the BSD License
           * See http://pajhome.org.uk/crypt/md5 for details.
           */

          var inherits = require('inherits');
          var Hash = require('./hash');
          var Buffer = require('safe-buffer').Buffer;

          var K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0];

          var W = new Array(80);

          function Sha1() {
            this.init();
            this._w = W;

            Hash.call(this, 64, 56);
          }

          inherits(Sha1, Hash);

          Sha1.prototype.init = function () {
            this._a = 0x67452301;
            this._b = 0xefcdab89;
            this._c = 0x98badcfe;
            this._d = 0x10325476;
            this._e = 0xc3d2e1f0;

            return this;
          };

          function rotl1(num) {
            return (num << 1) | (num >>> 31);
          }

          function rotl5(num) {
            return (num << 5) | (num >>> 27);
          }

          function rotl30(num) {
            return (num << 30) | (num >>> 2);
          }

          function ft(s, b, c, d) {
            if (s === 0) return (b & c) | (~b & d);
            if (s === 2) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
          }

          Sha1.prototype._update = function (M) {
            var W = this._w;

            var a = this._a | 0;
            var b = this._b | 0;
            var c = this._c | 0;
            var d = this._d | 0;
            var e = this._e | 0;

            for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
            for (; i < 80; ++i)
              W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);

            for (var j = 0; j < 80; ++j) {
              var s = ~~(j / 20);
              var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0;

              e = d;
              d = c;
              c = rotl30(b);
              b = a;
              a = t;
            }

            this._a = (a + this._a) | 0;
            this._b = (b + this._b) | 0;
            this._c = (c + this._c) | 0;
            this._d = (d + this._d) | 0;
            this._e = (e + this._e) | 0;
          };

          Sha1.prototype._hash = function () {
            var H = Buffer.allocUnsafe(20);

            H.writeInt32BE(this._a | 0, 0);
            H.writeInt32BE(this._b | 0, 4);
            H.writeInt32BE(this._c | 0, 8);
            H.writeInt32BE(this._d | 0, 12);
            H.writeInt32BE(this._e | 0, 16);

            return H;
          };

          module.exports = Sha1;
        },
        { './hash': 77, inherits: 55, 'safe-buffer': 76 },
      ],
      81: [
        function (require, module, exports) {
          /**
           * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
           * in FIPS 180-2
           * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
           * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
           *
           */

          var inherits = require('inherits');
          var Sha256 = require('./sha256');
          var Hash = require('./hash');
          var Buffer = require('safe-buffer').Buffer;

          var W = new Array(64);

          function Sha224() {
            this.init();

            this._w = W; // new Array(64)

            Hash.call(this, 64, 56);
          }

          inherits(Sha224, Sha256);

          Sha224.prototype.init = function () {
            this._a = 0xc1059ed8;
            this._b = 0x367cd507;
            this._c = 0x3070dd17;
            this._d = 0xf70e5939;
            this._e = 0xffc00b31;
            this._f = 0x68581511;
            this._g = 0x64f98fa7;
            this._h = 0xbefa4fa4;

            return this;
          };

          Sha224.prototype._hash = function () {
            var H = Buffer.allocUnsafe(28);

            H.writeInt32BE(this._a, 0);
            H.writeInt32BE(this._b, 4);
            H.writeInt32BE(this._c, 8);
            H.writeInt32BE(this._d, 12);
            H.writeInt32BE(this._e, 16);
            H.writeInt32BE(this._f, 20);
            H.writeInt32BE(this._g, 24);

            return H;
          };

          module.exports = Sha224;
        },
        { './hash': 77, './sha256': 82, inherits: 55, 'safe-buffer': 76 },
      ],
      82: [
        function (require, module, exports) {
          /**
           * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
           * in FIPS 180-2
           * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
           * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
           *
           */

          var inherits = require('inherits');
          var Hash = require('./hash');
          var Buffer = require('safe-buffer').Buffer;

          var K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
            0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
            0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
            0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
            0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
            0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
            0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
            0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
            0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
            0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
            0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
          ];

          var W = new Array(64);

          function Sha256() {
            this.init();

            this._w = W; // new Array(64)

            Hash.call(this, 64, 56);
          }

          inherits(Sha256, Hash);

          Sha256.prototype.init = function () {
            this._a = 0x6a09e667;
            this._b = 0xbb67ae85;
            this._c = 0x3c6ef372;
            this._d = 0xa54ff53a;
            this._e = 0x510e527f;
            this._f = 0x9b05688c;
            this._g = 0x1f83d9ab;
            this._h = 0x5be0cd19;

            return this;
          };

          function ch(x, y, z) {
            return z ^ (x & (y ^ z));
          }

          function maj(x, y, z) {
            return (x & y) | (z & (x | y));
          }

          function sigma0(x) {
            return (
              ((x >>> 2) | (x << 30)) ^
              ((x >>> 13) | (x << 19)) ^
              ((x >>> 22) | (x << 10))
            );
          }

          function sigma1(x) {
            return (
              ((x >>> 6) | (x << 26)) ^
              ((x >>> 11) | (x << 21)) ^
              ((x >>> 25) | (x << 7))
            );
          }

          function gamma0(x) {
            return (
              ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3)
            );
          }

          function gamma1(x) {
            return (
              ((x >>> 17) | (x << 15)) ^ ((x >>> 19) | (x << 13)) ^ (x >>> 10)
            );
          }

          Sha256.prototype._update = function (M) {
            var W = this._w;

            var a = this._a | 0;
            var b = this._b | 0;
            var c = this._c | 0;
            var d = this._d | 0;
            var e = this._e | 0;
            var f = this._f | 0;
            var g = this._g | 0;
            var h = this._h | 0;

            for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
            for (; i < 64; ++i)
              W[i] =
                (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) |
                0;

            for (var j = 0; j < 64; ++j) {
              var T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0;
              var T2 = (sigma0(a) + maj(a, b, c)) | 0;

              h = g;
              g = f;
              f = e;
              e = (d + T1) | 0;
              d = c;
              c = b;
              b = a;
              a = (T1 + T2) | 0;
            }

            this._a = (a + this._a) | 0;
            this._b = (b + this._b) | 0;
            this._c = (c + this._c) | 0;
            this._d = (d + this._d) | 0;
            this._e = (e + this._e) | 0;
            this._f = (f + this._f) | 0;
            this._g = (g + this._g) | 0;
            this._h = (h + this._h) | 0;
          };

          Sha256.prototype._hash = function () {
            var H = Buffer.allocUnsafe(32);

            H.writeInt32BE(this._a, 0);
            H.writeInt32BE(this._b, 4);
            H.writeInt32BE(this._c, 8);
            H.writeInt32BE(this._d, 12);
            H.writeInt32BE(this._e, 16);
            H.writeInt32BE(this._f, 20);
            H.writeInt32BE(this._g, 24);
            H.writeInt32BE(this._h, 28);

            return H;
          };

          module.exports = Sha256;
        },
        { './hash': 77, inherits: 55, 'safe-buffer': 76 },
      ],
      83: [
        function (require, module, exports) {
          var inherits = require('inherits');
          var SHA512 = require('./sha512');
          var Hash = require('./hash');
          var Buffer = require('safe-buffer').Buffer;

          var W = new Array(160);

          function Sha384() {
            this.init();
            this._w = W;

            Hash.call(this, 128, 112);
          }

          inherits(Sha384, SHA512);

          Sha384.prototype.init = function () {
            this._ah = 0xcbbb9d5d;
            this._bh = 0x629a292a;
            this._ch = 0x9159015a;
            this._dh = 0x152fecd8;
            this._eh = 0x67332667;
            this._fh = 0x8eb44a87;
            this._gh = 0xdb0c2e0d;
            this._hh = 0x47b5481d;

            this._al = 0xc1059ed8;
            this._bl = 0x367cd507;
            this._cl = 0x3070dd17;
            this._dl = 0xf70e5939;
            this._el = 0xffc00b31;
            this._fl = 0x68581511;
            this._gl = 0x64f98fa7;
            this._hl = 0xbefa4fa4;

            return this;
          };

          Sha384.prototype._hash = function () {
            var H = Buffer.allocUnsafe(48);

            function writeInt64BE(h, l, offset) {
              H.writeInt32BE(h, offset);
              H.writeInt32BE(l, offset + 4);
            }

            writeInt64BE(this._ah, this._al, 0);
            writeInt64BE(this._bh, this._bl, 8);
            writeInt64BE(this._ch, this._cl, 16);
            writeInt64BE(this._dh, this._dl, 24);
            writeInt64BE(this._eh, this._el, 32);
            writeInt64BE(this._fh, this._fl, 40);

            return H;
          };

          module.exports = Sha384;
        },
        { './hash': 77, './sha512': 84, inherits: 55, 'safe-buffer': 76 },
      ],
      84: [
        function (require, module, exports) {
          var inherits = require('inherits');
          var Hash = require('./hash');
          var Buffer = require('safe-buffer').Buffer;

          var K = [
            0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd, 0xb5c0fbcf,
            0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc, 0x3956c25b, 0xf348b538,
            0x59f111f1, 0xb605d019, 0x923f82a4, 0xaf194f9b, 0xab1c5ed5,
            0xda6d8118, 0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
            0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2, 0x72be5d74,
            0xf27b896f, 0x80deb1fe, 0x3b1696b1, 0x9bdc06a7, 0x25c71235,
            0xc19bf174, 0xcf692694, 0xe49b69c1, 0x9ef14ad2, 0xefbe4786,
            0x384f25e3, 0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
            0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483, 0x5cb0a9dc,
            0xbd41fbd4, 0x76f988da, 0x831153b5, 0x983e5152, 0xee66dfab,
            0xa831c66d, 0x2db43210, 0xb00327c8, 0x98fb213f, 0xbf597fc7,
            0xbeef0ee4, 0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
            0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70, 0x27b70a85,
            0x46d22ffc, 0x2e1b2138, 0x5c26c926, 0x4d2c6dfc, 0x5ac42aed,
            0x53380d13, 0x9d95b3df, 0x650a7354, 0x8baf63de, 0x766a0abb,
            0x3c77b2a8, 0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
            0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001, 0xc24b8b70,
            0xd0f89791, 0xc76c51a3, 0x0654be30, 0xd192e819, 0xd6ef5218,
            0xd6990624, 0x5565a910, 0xf40e3585, 0x5771202a, 0x106aa070,
            0x32bbd1b8, 0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
            0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8, 0x391c0cb3,
            0xc5c95a63, 0x4ed8aa4a, 0xe3418acb, 0x5b9cca4f, 0x7763e373,
            0x682e6ff3, 0xd6b2b8a3, 0x748f82ee, 0x5defb2fc, 0x78a5636f,
            0x43172f60, 0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
            0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9, 0xbef9a3f7,
            0xb2c67915, 0xc67178f2, 0xe372532b, 0xca273ece, 0xea26619c,
            0xd186b8c7, 0x21c0c207, 0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f,
            0xee6ed178, 0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
            0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b, 0x28db77f5,
            0x23047d84, 0x32caab7b, 0x40c72493, 0x3c9ebe0a, 0x15c9bebc,
            0x431d67c4, 0x9c100d4c, 0x4cc5d4be, 0xcb3e42b6, 0x597f299c,
            0xfc657e2a, 0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817,
          ];

          var W = new Array(160);

          function Sha512() {
            this.init();
            this._w = W;

            Hash.call(this, 128, 112);
          }

          inherits(Sha512, Hash);

          Sha512.prototype.init = function () {
            this._ah = 0x6a09e667;
            this._bh = 0xbb67ae85;
            this._ch = 0x3c6ef372;
            this._dh = 0xa54ff53a;
            this._eh = 0x510e527f;
            this._fh = 0x9b05688c;
            this._gh = 0x1f83d9ab;
            this._hh = 0x5be0cd19;

            this._al = 0xf3bcc908;
            this._bl = 0x84caa73b;
            this._cl = 0xfe94f82b;
            this._dl = 0x5f1d36f1;
            this._el = 0xade682d1;
            this._fl = 0x2b3e6c1f;
            this._gl = 0xfb41bd6b;
            this._hl = 0x137e2179;

            return this;
          };

          function Ch(x, y, z) {
            return z ^ (x & (y ^ z));
          }

          function maj(x, y, z) {
            return (x & y) | (z & (x | y));
          }

          function sigma0(x, xl) {
            return (
              ((x >>> 28) | (xl << 4)) ^
              ((xl >>> 2) | (x << 30)) ^
              ((xl >>> 7) | (x << 25))
            );
          }

          function sigma1(x, xl) {
            return (
              ((x >>> 14) | (xl << 18)) ^
              ((x >>> 18) | (xl << 14)) ^
              ((xl >>> 9) | (x << 23))
            );
          }

          function Gamma0(x, xl) {
            return (
              ((x >>> 1) | (xl << 31)) ^ ((x >>> 8) | (xl << 24)) ^ (x >>> 7)
            );
          }

          function Gamma0l(x, xl) {
            return (
              ((x >>> 1) | (xl << 31)) ^
              ((x >>> 8) | (xl << 24)) ^
              ((x >>> 7) | (xl << 25))
            );
          }

          function Gamma1(x, xl) {
            return (
              ((x >>> 19) | (xl << 13)) ^ ((xl >>> 29) | (x << 3)) ^ (x >>> 6)
            );
          }

          function Gamma1l(x, xl) {
            return (
              ((x >>> 19) | (xl << 13)) ^
              ((xl >>> 29) | (x << 3)) ^
              ((x >>> 6) | (xl << 26))
            );
          }

          function getCarry(a, b) {
            return a >>> 0 < b >>> 0 ? 1 : 0;
          }

          Sha512.prototype._update = function (M) {
            var W = this._w;

            var ah = this._ah | 0;
            var bh = this._bh | 0;
            var ch = this._ch | 0;
            var dh = this._dh | 0;
            var eh = this._eh | 0;
            var fh = this._fh | 0;
            var gh = this._gh | 0;
            var hh = this._hh | 0;

            var al = this._al | 0;
            var bl = this._bl | 0;
            var cl = this._cl | 0;
            var dl = this._dl | 0;
            var el = this._el | 0;
            var fl = this._fl | 0;
            var gl = this._gl | 0;
            var hl = this._hl | 0;

            for (var i = 0; i < 32; i += 2) {
              W[i] = M.readInt32BE(i * 4);
              W[i + 1] = M.readInt32BE(i * 4 + 4);
            }
            for (; i < 160; i += 2) {
              var xh = W[i - 15 * 2];
              var xl = W[i - 15 * 2 + 1];
              var gamma0 = Gamma0(xh, xl);
              var gamma0l = Gamma0l(xl, xh);

              xh = W[i - 2 * 2];
              xl = W[i - 2 * 2 + 1];
              var gamma1 = Gamma1(xh, xl);
              var gamma1l = Gamma1l(xl, xh);

              // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
              var Wi7h = W[i - 7 * 2];
              var Wi7l = W[i - 7 * 2 + 1];

              var Wi16h = W[i - 16 * 2];
              var Wi16l = W[i - 16 * 2 + 1];

              var Wil = (gamma0l + Wi7l) | 0;
              var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0;
              Wil = (Wil + gamma1l) | 0;
              Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0;
              Wil = (Wil + Wi16l) | 0;
              Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0;

              W[i] = Wih;
              W[i + 1] = Wil;
            }

            for (var j = 0; j < 160; j += 2) {
              Wih = W[j];
              Wil = W[j + 1];

              var majh = maj(ah, bh, ch);
              var majl = maj(al, bl, cl);

              var sigma0h = sigma0(ah, al);
              var sigma0l = sigma0(al, ah);
              var sigma1h = sigma1(eh, el);
              var sigma1l = sigma1(el, eh);

              // t1 = h + sigma1 + ch + K[j] + W[j]
              var Kih = K[j];
              var Kil = K[j + 1];

              var chh = Ch(eh, fh, gh);
              var chl = Ch(el, fl, gl);

              var t1l = (hl + sigma1l) | 0;
              var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0;
              t1l = (t1l + chl) | 0;
              t1h = (t1h + chh + getCarry(t1l, chl)) | 0;
              t1l = (t1l + Kil) | 0;
              t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0;
              t1l = (t1l + Wil) | 0;
              t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0;

              // t2 = sigma0 + maj
              var t2l = (sigma0l + majl) | 0;
              var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0;

              hh = gh;
              hl = gl;
              gh = fh;
              gl = fl;
              fh = eh;
              fl = el;
              el = (dl + t1l) | 0;
              eh = (dh + t1h + getCarry(el, dl)) | 0;
              dh = ch;
              dl = cl;
              ch = bh;
              cl = bl;
              bh = ah;
              bl = al;
              al = (t1l + t2l) | 0;
              ah = (t1h + t2h + getCarry(al, t1l)) | 0;
            }

            this._al = (this._al + al) | 0;
            this._bl = (this._bl + bl) | 0;
            this._cl = (this._cl + cl) | 0;
            this._dl = (this._dl + dl) | 0;
            this._el = (this._el + el) | 0;
            this._fl = (this._fl + fl) | 0;
            this._gl = (this._gl + gl) | 0;
            this._hl = (this._hl + hl) | 0;

            this._ah = (this._ah + ah + getCarry(this._al, al)) | 0;
            this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0;
            this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0;
            this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0;
            this._eh = (this._eh + eh + getCarry(this._el, el)) | 0;
            this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0;
            this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0;
            this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0;
          };

          Sha512.prototype._hash = function () {
            var H = Buffer.allocUnsafe(64);

            function writeInt64BE(h, l, offset) {
              H.writeInt32BE(h, offset);
              H.writeInt32BE(l, offset + 4);
            }

            writeInt64BE(this._ah, this._al, 0);
            writeInt64BE(this._bh, this._bl, 8);
            writeInt64BE(this._ch, this._cl, 16);
            writeInt64BE(this._dh, this._dl, 24);
            writeInt64BE(this._eh, this._el, 32);
            writeInt64BE(this._fh, this._fl, 40);
            writeInt64BE(this._gh, this._gl, 48);
            writeInt64BE(this._hh, this._hl, 56);

            return H;
          };

          module.exports = Sha512;
        },
        { './hash': 77, inherits: 55, 'safe-buffer': 76 },
      ],
      85: [
        function (require, module, exports) {
          arguments[4][30][0].apply(exports, arguments);
        },
        { dup: 30, 'safe-buffer': 76 },
      ],
      86: [
        function (require, module, exports) {
          var native = require('./native');

          function getTypeName(fn) {
            return fn.name || fn.toString().match(/function (.*?)\s*\(/)[1];
          }

          function getValueTypeName(value) {
            return native.Nil(value) ? '' : getTypeName(value.constructor);
          }

          function getValue(value) {
            if (native.Function(value)) return '';
            if (native.String(value)) return JSON.stringify(value);
            if (value && native.Object(value)) return '';
            return value;
          }

          function captureStackTrace(e, t) {
            if (Error.captureStackTrace) {
              Error.captureStackTrace(e, t);
            }
          }

          function tfJSON(type) {
            if (native.Function(type))
              return type.toJSON ? type.toJSON() : getTypeName(type);
            if (native.Array(type)) return 'Array';
            if (type && native.Object(type)) return 'Object';

            return type !== undefined ? type : '';
          }

          function tfErrorString(type, value, valueTypeName) {
            var valueJson = getValue(value);

            return (
              'Expected ' +
              tfJSON(type) +
              ', got' +
              (valueTypeName !== '' ? ' ' + valueTypeName : '') +
              (valueJson !== '' ? ' ' + valueJson : '')
            );
          }

          function TfTypeError(type, value, valueTypeName) {
            valueTypeName = valueTypeName || getValueTypeName(value);
            this.message = tfErrorString(type, value, valueTypeName);

            captureStackTrace(this, TfTypeError);
            this.__type = type;
            this.__value = value;
            this.__valueTypeName = valueTypeName;
          }

          TfTypeError.prototype = Object.create(Error.prototype);
          TfTypeError.prototype.constructor = TfTypeError;

          function tfPropertyErrorString(
            type,
            label,
            name,
            value,
            valueTypeName
          ) {
            var description = '" of type ';
            if (label === 'key') description = '" with key type ';

            return tfErrorString(
              'property "' + tfJSON(name) + description + tfJSON(type),
              value,
              valueTypeName
            );
          }

          function TfPropertyTypeError(
            type,
            property,
            label,
            value,
            valueTypeName
          ) {
            if (type) {
              valueTypeName = valueTypeName || getValueTypeName(value);
              this.message = tfPropertyErrorString(
                type,
                label,
                property,
                value,
                valueTypeName
              );
            } else {
              this.message = 'Unexpected property "' + property + '"';
            }

            captureStackTrace(this, TfTypeError);
            this.__label = label;
            this.__property = property;
            this.__type = type;
            this.__value = value;
            this.__valueTypeName = valueTypeName;
          }

          TfPropertyTypeError.prototype = Object.create(Error.prototype);
          TfPropertyTypeError.prototype.constructor = TfTypeError;

          function tfCustomError(expected, actual) {
            return new TfTypeError(expected, {}, actual);
          }

          function tfSubError(e, property, label) {
            // sub child?
            if (e instanceof TfPropertyTypeError) {
              property = property + '.' + e.__property;

              e = new TfPropertyTypeError(
                e.__type,
                property,
                e.__label,
                e.__value,
                e.__valueTypeName
              );

              // child?
            } else if (e instanceof TfTypeError) {
              e = new TfPropertyTypeError(
                e.__type,
                property,
                label,
                e.__value,
                e.__valueTypeName
              );
            }

            captureStackTrace(e);
            return e;
          }

          module.exports = {
            TfTypeError: TfTypeError,
            TfPropertyTypeError: TfPropertyTypeError,
            tfCustomError: tfCustomError,
            tfSubError: tfSubError,
            tfJSON: tfJSON,
            getValueTypeName: getValueTypeName,
          };
        },
        { './native': 89 },
      ],
      87: [
        function (require, module, exports) {
          (function (Buffer) {
            (function () {
              var NATIVE = require('./native');
              var ERRORS = require('./errors');

              function _Buffer(value) {
                return Buffer.isBuffer(value);
              }

              function Hex(value) {
                return (
                  typeof value === 'string' && /^([0-9a-f]{2})+$/i.test(value)
                );
              }

              function _LengthN(type, length) {
                var name = type.toJSON();

                function Length(value) {
                  if (!type(value)) return false;
                  if (value.length === length) return true;

                  throw ERRORS.tfCustomError(
                    name + '(Length: ' + length + ')',
                    name + '(Length: ' + value.length + ')'
                  );
                }
                Length.toJSON = function () {
                  return name;
                };

                return Length;
              }

              var _ArrayN = _LengthN.bind(null, NATIVE.Array);
              var _BufferN = _LengthN.bind(null, _Buffer);
              var _HexN = _LengthN.bind(null, Hex);
              var _StringN = _LengthN.bind(null, NATIVE.String);

              function Range(a, b, f) {
                f = f || NATIVE.Number;
                function _range(value, strict) {
                  return f(value, strict) && value > a && value < b;
                }
                _range.toJSON = function () {
                  return `${f.toJSON()} between [${a}, ${b}]`;
                };
                return _range;
              }

              var INT53_MAX = Math.pow(2, 53) - 1;

              function Finite(value) {
                return typeof value === 'number' && isFinite(value);
              }
              function Int8(value) {
                return (value << 24) >> 24 === value;
              }
              function Int16(value) {
                return (value << 16) >> 16 === value;
              }
              function Int32(value) {
                return (value | 0) === value;
              }
              function Int53(value) {
                return (
                  typeof value === 'number' &&
                  value >= -INT53_MAX &&
                  value <= INT53_MAX &&
                  Math.floor(value) === value
                );
              }
              function UInt8(value) {
                return (value & 0xff) === value;
              }
              function UInt16(value) {
                return (value & 0xffff) === value;
              }
              function UInt32(value) {
                return value >>> 0 === value;
              }
              function UInt53(value) {
                return (
                  typeof value === 'number' &&
                  value >= 0 &&
                  value <= INT53_MAX &&
                  Math.floor(value) === value
                );
              }

              var types = {
                ArrayN: _ArrayN,
                Buffer: _Buffer,
                BufferN: _BufferN,
                Finite: Finite,
                Hex: Hex,
                HexN: _HexN,
                Int8: Int8,
                Int16: Int16,
                Int32: Int32,
                Int53: Int53,
                Range: Range,
                StringN: _StringN,
                UInt8: UInt8,
                UInt16: UInt16,
                UInt32: UInt32,
                UInt53: UInt53,
              };

              for (var typeName in types) {
                types[typeName].toJSON = function (t) {
                  return t;
                }.bind(null, typeName);
              }

              module.exports = types;
            }.call(this));
          }.call(this, {
            isBuffer: require('C:/Users/mikki/AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js'),
          }));
        },
        {
          './errors': 86,
          './native': 89,
          'C:/Users/mikki/AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js': 11,
        },
      ],
      88: [
        function (require, module, exports) {
          var ERRORS = require('./errors');
          var NATIVE = require('./native');

          // short-hand
          var tfJSON = ERRORS.tfJSON;
          var TfTypeError = ERRORS.TfTypeError;
          var TfPropertyTypeError = ERRORS.TfPropertyTypeError;
          var tfSubError = ERRORS.tfSubError;
          var getValueTypeName = ERRORS.getValueTypeName;

          var TYPES = {
            arrayOf: function arrayOf(type, options) {
              type = compile(type);
              options = options || {};

              function _arrayOf(array, strict) {
                if (!NATIVE.Array(array)) return false;
                if (NATIVE.Nil(array)) return false;
                if (
                  options.minLength !== undefined &&
                  array.length < options.minLength
                )
                  return false;
                if (
                  options.maxLength !== undefined &&
                  array.length > options.maxLength
                )
                  return false;
                if (
                  options.length !== undefined &&
                  array.length !== options.length
                )
                  return false;

                return array.every(function (value, i) {
                  try {
                    return typeforce(type, value, strict);
                  } catch (e) {
                    throw tfSubError(e, i);
                  }
                });
              }
              _arrayOf.toJSON = function () {
                var str = '[' + tfJSON(type) + ']';
                if (options.length !== undefined) {
                  str += '{' + options.length + '}';
                } else if (
                  options.minLength !== undefined ||
                  options.maxLength !== undefined
                ) {
                  str +=
                    '{' +
                    (options.minLength === undefined ? 0 : options.minLength) +
                    ',' +
                    (options.maxLength === undefined
                      ? Infinity
                      : options.maxLength) +
                    '}';
                }
                return str;
              };

              return _arrayOf;
            },

            maybe: function maybe(type) {
              type = compile(type);

              function _maybe(value, strict) {
                return NATIVE.Nil(value) || type(value, strict, maybe);
              }
              _maybe.toJSON = function () {
                return '?' + tfJSON(type);
              };

              return _maybe;
            },

            map: function map(propertyType, propertyKeyType) {
              propertyType = compile(propertyType);
              if (propertyKeyType) propertyKeyType = compile(propertyKeyType);

              function _map(value, strict) {
                if (!NATIVE.Object(value)) return false;
                if (NATIVE.Nil(value)) return false;

                for (var propertyName in value) {
                  try {
                    if (propertyKeyType) {
                      typeforce(propertyKeyType, propertyName, strict);
                    }
                  } catch (e) {
                    throw tfSubError(e, propertyName, 'key');
                  }

                  try {
                    var propertyValue = value[propertyName];
                    typeforce(propertyType, propertyValue, strict);
                  } catch (e) {
                    throw tfSubError(e, propertyName);
                  }
                }

                return true;
              }

              if (propertyKeyType) {
                _map.toJSON = function () {
                  return (
                    '{' +
                    tfJSON(propertyKeyType) +
                    ': ' +
                    tfJSON(propertyType) +
                    '}'
                  );
                };
              } else {
                _map.toJSON = function () {
                  return '{' + tfJSON(propertyType) + '}';
                };
              }

              return _map;
            },

            object: function object(uncompiled) {
              var type = {};

              for (var typePropertyName in uncompiled) {
                type[typePropertyName] = compile(uncompiled[typePropertyName]);
              }

              function _object(value, strict) {
                if (!NATIVE.Object(value)) return false;
                if (NATIVE.Nil(value)) return false;

                var propertyName;

                try {
                  for (propertyName in type) {
                    var propertyType = type[propertyName];
                    var propertyValue = value[propertyName];

                    typeforce(propertyType, propertyValue, strict);
                  }
                } catch (e) {
                  throw tfSubError(e, propertyName);
                }

                if (strict) {
                  for (propertyName in value) {
                    if (type[propertyName]) continue;

                    throw new TfPropertyTypeError(undefined, propertyName);
                  }
                }

                return true;
              }
              _object.toJSON = function () {
                return tfJSON(type);
              };

              return _object;
            },

            anyOf: function anyOf() {
              var types = [].slice.call(arguments).map(compile);

              function _anyOf(value, strict) {
                return types.some(function (type) {
                  try {
                    return typeforce(type, value, strict);
                  } catch (e) {
                    return false;
                  }
                });
              }
              _anyOf.toJSON = function () {
                return types.map(tfJSON).join('|');
              };

              return _anyOf;
            },

            allOf: function allOf() {
              var types = [].slice.call(arguments).map(compile);

              function _allOf(value, strict) {
                return types.every(function (type) {
                  try {
                    return typeforce(type, value, strict);
                  } catch (e) {
                    return false;
                  }
                });
              }
              _allOf.toJSON = function () {
                return types.map(tfJSON).join(' & ');
              };

              return _allOf;
            },

            quacksLike: function quacksLike(type) {
              function _quacksLike(value) {
                return type === getValueTypeName(value);
              }
              _quacksLike.toJSON = function () {
                return type;
              };

              return _quacksLike;
            },

            tuple: function tuple() {
              var types = [].slice.call(arguments).map(compile);

              function _tuple(values, strict) {
                if (NATIVE.Nil(values)) return false;
                if (NATIVE.Nil(values.length)) return false;
                if (strict && values.length !== types.length) return false;

                return types.every(function (type, i) {
                  try {
                    return typeforce(type, values[i], strict);
                  } catch (e) {
                    throw tfSubError(e, i);
                  }
                });
              }
              _tuple.toJSON = function () {
                return '(' + types.map(tfJSON).join(', ') + ')';
              };

              return _tuple;
            },

            value: function value(expected) {
              function _value(actual) {
                return actual === expected;
              }
              _value.toJSON = function () {
                return expected;
              };

              return _value;
            },
          };

          // TODO: deprecate
          TYPES.oneOf = TYPES.anyOf;

          function compile(type) {
            if (NATIVE.String(type)) {
              if (type[0] === '?') return TYPES.maybe(type.slice(1));

              return NATIVE[type] || TYPES.quacksLike(type);
            } else if (type && NATIVE.Object(type)) {
              if (NATIVE.Array(type)) {
                if (type.length !== 1)
                  throw new TypeError(
                    'Expected compile() parameter of type Array of length 1'
                  );
                return TYPES.arrayOf(type[0]);
              }

              return TYPES.object(type);
            } else if (NATIVE.Function(type)) {
              return type;
            }

            return TYPES.value(type);
          }

          function typeforce(type, value, strict, surrogate) {
            if (NATIVE.Function(type)) {
              if (type(value, strict)) return true;

              throw new TfTypeError(surrogate || type, value);
            }

            // JIT
            return typeforce(compile(type), value, strict);
          }

          // assign types to typeforce function
          for (var typeName in NATIVE) {
            typeforce[typeName] = NATIVE[typeName];
          }

          for (typeName in TYPES) {
            typeforce[typeName] = TYPES[typeName];
          }

          var EXTRA = require('./extra');
          for (typeName in EXTRA) {
            typeforce[typeName] = EXTRA[typeName];
          }

          typeforce.compile = compile;
          typeforce.TfTypeError = TfTypeError;
          typeforce.TfPropertyTypeError = TfPropertyTypeError;

          module.exports = typeforce;
        },
        { './errors': 86, './extra': 87, './native': 89 },
      ],
      89: [
        function (require, module, exports) {
          var types = {
            Array: function (value) {
              return (
                value !== null &&
                value !== undefined &&
                value.constructor === Array
              );
            },
            Boolean: function (value) {
              return typeof value === 'boolean';
            },
            Function: function (value) {
              return typeof value === 'function';
            },
            Nil: function (value) {
              return value === undefined || value === null;
            },
            Number: function (value) {
              return typeof value === 'number';
            },
            Object: function (value) {
              return typeof value === 'object';
            },
            String: function (value) {
              return typeof value === 'string';
            },
            '': function () {
              return true;
            },
          };

          // TODO: deprecate
          types.Null = types.Nil;

          for (var typeName in types) {
            types[typeName].toJSON = function (t) {
              return t;
            }.bind(null, typeName);
          }

          module.exports = types;
        },
        {},
      ],
      90: [
        function (require, module, exports) {
          arguments[4][31][0].apply(exports, arguments);
        },
        { dup: 31 },
      ],
      91: [
        function (require, module, exports) {
          'use strict';
          var Buffer = require('safe-buffer').Buffer;

          // Number.MAX_SAFE_INTEGER
          var MAX_SAFE_INTEGER = 9007199254740991;

          function checkUInt53(n) {
            if (n < 0 || n > MAX_SAFE_INTEGER || n % 1 !== 0)
              throw new RangeError('value out of range');
          }

          function encode(number, buffer, offset) {
            checkUInt53(number);

            if (!buffer) buffer = Buffer.allocUnsafe(encodingLength(number));
            if (!Buffer.isBuffer(buffer))
              throw new TypeError('buffer must be a Buffer instance');
            if (!offset) offset = 0;

            // 8 bit
            if (number < 0xfd) {
              buffer.writeUInt8(number, offset);
              encode.bytes = 1;

              // 16 bit
            } else if (number <= 0xffff) {
              buffer.writeUInt8(0xfd, offset);
              buffer.writeUInt16LE(number, offset + 1);
              encode.bytes = 3;

              // 32 bit
            } else if (number <= 0xffffffff) {
              buffer.writeUInt8(0xfe, offset);
              buffer.writeUInt32LE(number, offset + 1);
              encode.bytes = 5;

              // 64 bit
            } else {
              buffer.writeUInt8(0xff, offset);
              buffer.writeUInt32LE(number >>> 0, offset + 1);
              buffer.writeUInt32LE((number / 0x100000000) | 0, offset + 5);
              encode.bytes = 9;
            }

            return buffer;
          }

          function decode(buffer, offset) {
            if (!Buffer.isBuffer(buffer))
              throw new TypeError('buffer must be a Buffer instance');
            if (!offset) offset = 0;

            var first = buffer.readUInt8(offset);

            // 8 bit
            if (first < 0xfd) {
              decode.bytes = 1;
              return first;

              // 16 bit
            } else if (first === 0xfd) {
              decode.bytes = 3;
              return buffer.readUInt16LE(offset + 1);

              // 32 bit
            } else if (first === 0xfe) {
              decode.bytes = 5;
              return buffer.readUInt32LE(offset + 1);

              // 64 bit
            } else {
              decode.bytes = 9;
              var lo = buffer.readUInt32LE(offset + 1);
              var hi = buffer.readUInt32LE(offset + 5);
              var number = hi * 0x0100000000 + lo;
              checkUInt53(number);

              return number;
            }
          }

          function encodingLength(number) {
            checkUInt53(number);

            return number < 0xfd
              ? 1
              : number <= 0xffff
              ? 3
              : number <= 0xffffffff
              ? 5
              : 9;
          }

          module.exports = {
            encode: encode,
            decode: decode,
            encodingLength: encodingLength,
          };
        },
        { 'safe-buffer': 76 },
      ],
      92: [
        function (require, module, exports) {
          (function (Buffer) {
            (function () {
              var bs58check = require('bs58check');

              function decodeRaw(buffer, version) {
                // check version only if defined
                if (version !== undefined && buffer[0] !== version)
                  throw new Error('Invalid network version');

                // uncompressed
                if (buffer.length === 33) {
                  return {
                    version: buffer[0],
                    privateKey: buffer.slice(1, 33),
                    compressed: false,
                  };
                }

                // invalid length
                if (buffer.length !== 34) throw new Error('Invalid WIF length');

                // invalid compression flag
                if (buffer[33] !== 0x01)
                  throw new Error('Invalid compression flag');

                return {
                  version: buffer[0],
                  privateKey: buffer.slice(1, 33),
                  compressed: true,
                };
              }

              function encodeRaw(version, privateKey, compressed) {
                var result = new Buffer(compressed ? 34 : 33);

                result.writeUInt8(version, 0);
                privateKey.copy(result, 1);

                if (compressed) {
                  result[33] = 0x01;
                }

                return result;
              }

              function decode(string, version) {
                return decodeRaw(bs58check.decode(string), version);
              }

              function encode(version, privateKey, compressed) {
                if (typeof version === 'number')
                  return bs58check.encode(
                    encodeRaw(version, privateKey, compressed)
                  );

                return bs58check.encode(
                  encodeRaw(
                    version.version,
                    version.privateKey,
                    version.compressed
                  )
                );
              }

              module.exports = {
                decode: decode,
                decodeRaw: decodeRaw,
                encode: encode,
                encodeRaw: encodeRaw,
              };
            }.call(this));
          }.call(this, require('buffer').Buffer));
        },
        { bs58check: 43, buffer: 7 },
      ],
      93: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;
          var bech32 = require('bech32');
          var bs58check = require('bs58check');
          var bscript = require('./script');
          var btemplates = require('./templates');
          var networks = require('./networks');
          var typeforce = require('typeforce');
          var types = require('./types');

          function fromBase58Check(address) {
            var payload = bs58check.decode(address);

            // TODO: 4.0.0, move to "toOutputScript"
            if (payload.length < 21)
              throw new TypeError(address + ' is too short');
            if (payload.length > 21)
              throw new TypeError(address + ' is too long');

            var version = payload.readUInt8(0);
            var hash = payload.slice(1);

            return { version: version, hash: hash };
          }

          function fromBech32(address) {
            var result = bech32.decode(address);
            var data = bech32.fromWords(result.words.slice(1));

            return {
              version: result.words[0],
              prefix: result.prefix,
              data: Buffer.from(data),
            };
          }

          function toBase58Check(hash, version) {
            typeforce(types.tuple(types.Hash160bit, types.UInt8), arguments);

            var payload = Buffer.allocUnsafe(21);
            payload.writeUInt8(version, 0);
            hash.copy(payload, 1);

            return bs58check.encode(payload);
          }

          function toBech32(data, version, prefix) {
            var words = bech32.toWords(data);
            words.unshift(version);

            return bech32.encode(prefix, words);
          }

          function fromOutputScript(outputScript, network) {
            network = network || networks.auroracoin;

            if (btemplates.pubKeyHash.output.check(outputScript))
              return toBase58Check(
                bscript.compile(outputScript).slice(3, 23),
                network.pubKeyHash
              );
            if (btemplates.scriptHash.output.check(outputScript))
              return toBase58Check(
                bscript.compile(outputScript).slice(2, 22),
                network.scriptHash
              );
            if (btemplates.witnessPubKeyHash.output.check(outputScript))
              return toBech32(
                bscript.compile(outputScript).slice(2, 22),
                0,
                network.bech32
              );
            if (btemplates.witnessScriptHash.output.check(outputScript))
              return toBech32(
                bscript.compile(outputScript).slice(2, 34),
                0,
                network.bech32
              );

            throw new Error(
              bscript.toASM(outputScript) + ' has no matching Address'
            );
          }

          function toOutputScript(address, network) {
            network = network || networks.auroracoin;

            var decode;
            try {
              decode = fromBase58Check(address);
            } catch (e) {}

            if (decode) {
              if (decode.version === network.pubKeyHash)
                return btemplates.pubKeyHash.output.encode(decode.hash);
              if (decode.version === network.scriptHash)
                return btemplates.scriptHash.output.encode(decode.hash);
            } else {
              try {
                decode = fromBech32(address);
              } catch (e) {}

              if (decode) {
                if (decode.prefix !== network.bech32)
                  throw new Error(address + ' has an invalid prefix');
                if (decode.version === 0) {
                  if (decode.data.length === 20)
                    return btemplates.witnessPubKeyHash.output.encode(
                      decode.data
                    );
                  if (decode.data.length === 32)
                    return btemplates.witnessScriptHash.output.encode(
                      decode.data
                    );
                }
              }
            }

            throw new Error(address + ' has no matching Script');
          }

          module.exports = {
            fromBase58Check: fromBase58Check,
            fromBech32: fromBech32,
            fromOutputScript: fromOutputScript,
            toBase58Check: toBase58Check,
            toBech32: toBech32,
            toOutputScript: toOutputScript,
          };
        },
        {
          './networks': 101,
          './script': 102,
          './templates': 104,
          './types': 128,
          bech32: 33,
          bs58check: 43,
          'safe-buffer': 76,
          typeforce: 88,
        },
      ],
      94: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;
          var bcrypto = require('./crypto');
          var fastMerkleRoot = require('merkle-lib/fastRoot');
          var typeforce = require('typeforce');
          var types = require('./types');
          var varuint = require('varuint-bitcoin');

          var Transaction = require('./transaction');

          function Block() {
            this.version = 1;
            this.prevHash = null;
            this.merkleRoot = null;
            this.timestamp = 0;
            this.bits = 0;
            this.nonce = 0;
          }

          Block.fromBuffer = function (buffer) {
            if (buffer.length < 80)
              throw new Error('Buffer too small (< 80 bytes)');

            var offset = 0;
            function readSlice(n) {
              offset += n;
              return buffer.slice(offset - n, offset);
            }

            function readUInt32() {
              var i = buffer.readUInt32LE(offset);
              offset += 4;
              return i;
            }

            function readInt32() {
              var i = buffer.readInt32LE(offset);
              offset += 4;
              return i;
            }

            var block = new Block();
            block.version = readInt32();
            block.prevHash = readSlice(32);
            block.merkleRoot = readSlice(32);
            block.timestamp = readUInt32();
            block.bits = readUInt32();
            block.nonce = readUInt32();

            if (buffer.length === 80) return block;

            function readVarInt() {
              var vi = varuint.decode(buffer, offset);
              offset += varuint.decode.bytes;
              return vi;
            }

            function readTransaction() {
              var tx = Transaction.fromBuffer(buffer.slice(offset), true);
              offset += tx.byteLength();
              return tx;
            }

            var nTransactions = readVarInt();
            block.transactions = [];

            for (var i = 0; i < nTransactions; ++i) {
              var tx = readTransaction();
              block.transactions.push(tx);
            }

            return block;
          };

          Block.prototype.byteLength = function (headersOnly) {
            if (headersOnly || !this.transactions) return 80;

            return (
              80 +
              varuint.encodingLength(this.transactions.length) +
              this.transactions.reduce(function (a, x) {
                return a + x.byteLength();
              }, 0)
            );
          };

          Block.fromHex = function (hex) {
            return Block.fromBuffer(Buffer.from(hex, 'hex'));
          };

          Block.prototype.getHash = function () {
            return bcrypto.hash256(this.toBuffer(true));
          };

          Block.prototype.getId = function () {
            return this.getHash().reverse().toString('hex');
          };

          Block.prototype.getUTCDate = function () {
            var date = new Date(0); // epoch
            date.setUTCSeconds(this.timestamp);

            return date;
          };

          // TODO: buffer, offset compatibility
          Block.prototype.toBuffer = function (headersOnly) {
            var buffer = Buffer.allocUnsafe(this.byteLength(headersOnly));

            var offset = 0;
            function writeSlice(slice) {
              slice.copy(buffer, offset);
              offset += slice.length;
            }

            function writeInt32(i) {
              buffer.writeInt32LE(i, offset);
              offset += 4;
            }
            function writeUInt32(i) {
              buffer.writeUInt32LE(i, offset);
              offset += 4;
            }

            writeInt32(this.version);
            writeSlice(this.prevHash);
            writeSlice(this.merkleRoot);
            writeUInt32(this.timestamp);
            writeUInt32(this.bits);
            writeUInt32(this.nonce);

            if (headersOnly || !this.transactions) return buffer;

            varuint.encode(this.transactions.length, buffer, offset);
            offset += varuint.encode.bytes;

            this.transactions.forEach(function (tx) {
              var txSize = tx.byteLength(); // TODO: extract from toBuffer?
              tx.toBuffer(buffer, offset);
              offset += txSize;
            });

            return buffer;
          };

          Block.prototype.toHex = function (headersOnly) {
            return this.toBuffer(headersOnly).toString('hex');
          };

          Block.calculateTarget = function (bits) {
            var exponent = ((bits & 0xff000000) >> 24) - 3;
            var mantissa = bits & 0x007fffff;
            var target = Buffer.alloc(32, 0);
            target.writeUInt32BE(mantissa, 28 - exponent);
            return target;
          };

          Block.calculateMerkleRoot = function (transactions) {
            typeforce([{ getHash: types.Function }], transactions);
            if (transactions.length === 0)
              throw TypeError(
                'Cannot compute merkle root for zero transactions'
              );

            var hashes = transactions.map(function (transaction) {
              return transaction.getHash();
            });

            return fastMerkleRoot(hashes, bcrypto.hash256);
          };

          Block.prototype.checkMerkleRoot = function () {
            if (!this.transactions) return false;

            var actualMerkleRoot = Block.calculateMerkleRoot(this.transactions);
            return this.merkleRoot.compare(actualMerkleRoot) === 0;
          };

          Block.prototype.checkProofOfWork = function () {
            var hash = this.getHash().reverse();
            var target = Block.calculateTarget(this.bits);

            return hash.compare(target) <= 0;
          };

          module.exports = Block;
        },
        {
          './crypto': 96,
          './transaction': 126,
          './types': 128,
          'merkle-lib/fastRoot': 57,
          'safe-buffer': 76,
          typeforce: 88,
          'varuint-bitcoin': 91,
        },
      ],
      95: [
        function (require, module, exports) {
          var pushdata = require('pushdata-bitcoin');
          var varuint = require('varuint-bitcoin');

          // https://github.com/feross/buffer/blob/master/index.js#L1127
          function verifuint(value, max) {
            if (typeof value !== 'number')
              throw new Error('cannot write a non-number as a number');
            if (value < 0)
              throw new Error(
                'specified a negative value for writing an unsigned value'
              );
            if (value > max) throw new Error('RangeError: value out of range');
            if (Math.floor(value) !== value)
              throw new Error('value has a fractional component');
          }

          function readUInt64LE(buffer, offset) {
            var a = buffer.readUInt32LE(offset);
            var b = buffer.readUInt32LE(offset + 4);
            b *= 0x100000000;

            verifuint(b + a, 0x001fffffffffffff);

            return b + a;
          }

          function writeUInt64LE(buffer, value, offset) {
            verifuint(value, 0x001fffffffffffff);

            buffer.writeInt32LE(value & -1, offset);
            buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
            return offset + 8;
          }

          // TODO: remove in 4.0.0?
          function readVarInt(buffer, offset) {
            var result = varuint.decode(buffer, offset);

            return {
              number: result,
              size: varuint.decode.bytes,
            };
          }

          // TODO: remove in 4.0.0?
          function writeVarInt(buffer, number, offset) {
            varuint.encode(number, buffer, offset);
            return varuint.encode.bytes;
          }

          module.exports = {
            pushDataSize: pushdata.encodingLength,
            readPushDataInt: pushdata.decode,
            readUInt64LE: readUInt64LE,
            readVarInt: readVarInt,
            varIntBuffer: varuint.encode,
            varIntSize: varuint.encodingLength,
            writePushDataInt: pushdata.encode,
            writeUInt64LE: writeUInt64LE,
            writeVarInt: writeVarInt,
          };
        },
        { 'pushdata-bitcoin': 58, 'varuint-bitcoin': 91 },
      ],
      96: [
        function (require, module, exports) {
          var createHash = require('create-hash');

          function ripemd160(buffer) {
            return createHash('rmd160').update(buffer).digest();
          }

          function sha1(buffer) {
            return createHash('sha1').update(buffer).digest();
          }

          function sha256(buffer) {
            return createHash('sha256').update(buffer).digest();
          }

          function hash160(buffer) {
            return ripemd160(sha256(buffer));
          }

          function hash256(buffer) {
            return sha256(sha256(buffer));
          }

          module.exports = {
            hash160: hash160,
            hash256: hash256,
            ripemd160: ripemd160,
            sha1: sha1,
            sha256: sha256,
          };
        },
        { 'create-hash': 45 },
      ],
      97: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;
          var createHmac = require('create-hmac');
          var typeforce = require('typeforce');
          var types = require('./types');

          var BigInteger = require('bigi');
          var ECSignature = require('./ecsignature');

          var ZERO = Buffer.alloc(1, 0);
          var ONE = Buffer.alloc(1, 1);

          var ecurve = require('ecurve');
          var secp256k1 = ecurve.getCurveByName('secp256k1');

          // https://tools.ietf.org/html/rfc6979#section-3.2
          function deterministicGenerateK(hash, x, checkSig) {
            typeforce(
              types.tuple(types.Hash256bit, types.Buffer256bit, types.Function),
              arguments
            );

            // Step A, ignored as hash already provided
            // Step B
            // Step C
            var k = Buffer.alloc(32, 0);
            var v = Buffer.alloc(32, 1);

            // Step D
            k = createHmac('sha256', k)
              .update(v)
              .update(ZERO)
              .update(x)
              .update(hash)
              .digest();

            // Step E
            v = createHmac('sha256', k).update(v).digest();

            // Step F
            k = createHmac('sha256', k)
              .update(v)
              .update(ONE)
              .update(x)
              .update(hash)
              .digest();

            // Step G
            v = createHmac('sha256', k).update(v).digest();

            // Step H1/H2a, ignored as tlen === qlen (256 bit)
            // Step H2b
            v = createHmac('sha256', k).update(v).digest();

            var T = BigInteger.fromBuffer(v);

            // Step H3, repeat until T is within the interval [1, n - 1] and is suitable for ECDSA
            while (
              T.signum() <= 0 ||
              T.compareTo(secp256k1.n) >= 0 ||
              !checkSig(T)
            ) {
              k = createHmac('sha256', k).update(v).update(ZERO).digest();

              v = createHmac('sha256', k).update(v).digest();

              // Step H1/H2a, again, ignored as tlen === qlen (256 bit)
              // Step H2b again
              v = createHmac('sha256', k).update(v).digest();
              T = BigInteger.fromBuffer(v);
            }

            return T;
          }

          var N_OVER_TWO = secp256k1.n.shiftRight(1);

          function sign(hash, d) {
            typeforce(types.tuple(types.Hash256bit, types.BigInt), arguments);

            var x = d.toBuffer(32);
            var e = BigInteger.fromBuffer(hash);
            var n = secp256k1.n;
            var G = secp256k1.G;

            var r, s;
            deterministicGenerateK(hash, x, function (k) {
              var Q = G.multiply(k);

              if (secp256k1.isInfinity(Q)) return false;

              r = Q.affineX.mod(n);
              if (r.signum() === 0) return false;

              s = k
                .modInverse(n)
                .multiply(e.add(d.multiply(r)))
                .mod(n);
              if (s.signum() === 0) return false;

              return true;
            });

            // enforce low S values, see bip62: 'low s values in signatures'
            if (s.compareTo(N_OVER_TWO) > 0) {
              s = n.subtract(s);
            }

            return new ECSignature(r, s);
          }

          function verify(hash, signature, Q) {
            typeforce(
              types.tuple(types.Hash256bit, types.ECSignature, types.ECPoint),
              arguments
            );

            var n = secp256k1.n;
            var G = secp256k1.G;

            var r = signature.r;
            var s = signature.s;

            // 1.4.1 Enforce r and s are both integers in the interval [1, n − 1]
            if (r.signum() <= 0 || r.compareTo(n) >= 0) return false;
            if (s.signum() <= 0 || s.compareTo(n) >= 0) return false;

            // 1.4.2 H = Hash(M), already done by the user
            // 1.4.3 e = H
            var e = BigInteger.fromBuffer(hash);

            // Compute s^-1
            var sInv = s.modInverse(n);

            // 1.4.4 Compute u1 = es^−1 mod n
            //               u2 = rs^−1 mod n
            var u1 = e.multiply(sInv).mod(n);
            var u2 = r.multiply(sInv).mod(n);

            // 1.4.5 Compute R = (xR, yR)
            //               R = u1G + u2Q
            var R = G.multiplyTwo(u1, Q, u2);

            // 1.4.5 (cont.) Enforce R is not at infinity
            if (secp256k1.isInfinity(R)) return false;

            // 1.4.6 Convert the field element R.x to an integer
            var xR = R.affineX;

            // 1.4.7 Set v = xR mod n
            var v = xR.mod(n);

            // 1.4.8 If v = r, output "valid", and if v != r, output "invalid"
            return v.equals(r);
          }

          module.exports = {
            deterministicGenerateK: deterministicGenerateK,
            sign: sign,
            verify: verify,

            // TODO: remove
            __curve: secp256k1,
          };
        },
        {
          './ecsignature': 99,
          './types': 128,
          bigi: 36,
          'create-hmac': 47,
          ecurve: 51,
          'safe-buffer': 76,
          typeforce: 88,
        },
      ],
      98: [
        function (require, module, exports) {
          var baddress = require('./address');
          var bcrypto = require('./crypto');
          var ecdsa = require('./ecdsa');
          var randomBytes = require('randombytes');
          var typeforce = require('typeforce');
          var types = require('./types');
          var wif = require('wif');

          var NETWORKS = require('./networks');
          var BigInteger = require('bigi');

          var ecurve = require('ecurve');
          var secp256k1 = ecdsa.__curve;

          function ECPair(d, Q, options) {
            if (options) {
              typeforce(
                {
                  compressed: types.maybe(types.Boolean),
                  network: types.maybe(types.Network),
                },
                options
              );
            }

            options = options || {};

            if (d) {
              if (d.signum() <= 0)
                throw new Error('Private key must be greater than 0');
              if (d.compareTo(secp256k1.n) >= 0)
                throw new Error(
                  'Private key must be less than the curve order'
                );
              if (Q) throw new TypeError('Unexpected publicKey parameter');

              this.d = d;
            } else {
              typeforce(types.ECPoint, Q);

              this.__Q = Q;
            }

            this.compressed =
              options.compressed === undefined ? true : options.compressed;
            this.network = options.network || NETWORKS.auroracoin;
          }

          Object.defineProperty(ECPair.prototype, 'Q', {
            get: function () {
              if (!this.__Q && this.d) {
                this.__Q = secp256k1.G.multiply(this.d);
              }

              return this.__Q;
            },
          });

          ECPair.fromPublicKeyBuffer = function (buffer, network) {
            var Q = ecurve.Point.decodeFrom(secp256k1, buffer);

            return new ECPair(null, Q, {
              compressed: Q.compressed,
              network: network,
            });
          };

          ECPair.fromWIF = function (string, network) {
            var decoded = wif.decode(string);
            var version = decoded.version;

            // list of networks?
            if (types.Array(network)) {
              network = network
                .filter(function (x) {
                  return version === x.wif;
                })
                .pop();

              if (!network) throw new Error('Unknown network version');

              // otherwise, assume a network object (or default to bitcoin)
            } else {
              network = network || NETWORKS.auroracoin;

              if (version !== network.wif)
                throw new Error('Invalid network version');
            }

            var d = BigInteger.fromBuffer(decoded.privateKey);

            return new ECPair(d, null, {
              compressed: decoded.compressed,
              network: network,
            });
          };

          ECPair.makeRandom = function (options) {
            options = options || {};

            var rng = options.rng || randomBytes;

            var d;
            do {
              var buffer = rng(32);
              typeforce(types.Buffer256bit, buffer);

              d = BigInteger.fromBuffer(buffer);
            } while (d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0);

            return new ECPair(d, null, options);
          };

          ECPair.prototype.getAddress = function () {
            return baddress.toBase58Check(
              bcrypto.hash160(this.getPublicKeyBuffer()),
              this.getNetwork().pubKeyHash
            );
          };

          ECPair.prototype.getNetwork = function () {
            return this.network;
          };

          ECPair.prototype.getPublicKeyBuffer = function () {
            return this.Q.getEncoded(this.compressed);
          };

          ECPair.prototype.sign = function (hash) {
            if (!this.d) throw new Error('Missing private key');

            return ecdsa.sign(hash, this.d);
          };

          ECPair.prototype.toWIF = function () {
            if (!this.d) throw new Error('Missing private key');

            return wif.encode(
              this.network.wif,
              this.d.toBuffer(32),
              this.compressed
            );
          };

          ECPair.prototype.verify = function (hash, signature) {
            return ecdsa.verify(hash, signature, this.Q);
          };

          module.exports = ECPair;
        },
        {
          './address': 93,
          './crypto': 96,
          './ecdsa': 97,
          './networks': 101,
          './types': 128,
          bigi: 36,
          ecurve: 51,
          randombytes: 59,
          typeforce: 88,
          wif: 92,
        },
      ],
      99: [
        function (require, module, exports) {
          (function (Buffer) {
            (function () {
              var bip66 = require('bip66');
              var typeforce = require('typeforce');
              var types = require('./types');

              var BigInteger = require('bigi');

              function ECSignature(r, s) {
                typeforce(types.tuple(types.BigInt, types.BigInt), arguments);

                this.r = r;
                this.s = s;
              }

              ECSignature.parseCompact = function (buffer) {
                typeforce(types.BufferN(65), buffer);

                var flagByte = buffer.readUInt8(0) - 27;
                if (flagByte !== (flagByte & 7))
                  throw new Error('Invalid signature parameter');

                var compressed = !!(flagByte & 4);
                var recoveryParam = flagByte & 3;
                var signature = ECSignature.fromRSBuffer(buffer.slice(1));

                return {
                  compressed: compressed,
                  i: recoveryParam,
                  signature: signature,
                };
              };

              ECSignature.fromRSBuffer = function (buffer) {
                typeforce(types.BufferN(64), buffer);

                var r = BigInteger.fromBuffer(buffer.slice(0, 32));
                var s = BigInteger.fromBuffer(buffer.slice(32, 64));
                return new ECSignature(r, s);
              };

              ECSignature.fromDER = function (buffer) {
                var decode = bip66.decode(buffer);
                var r = BigInteger.fromDERInteger(decode.r);
                var s = BigInteger.fromDERInteger(decode.s);

                return new ECSignature(r, s);
              };

              // BIP62: 1 byte hashType flag (only 0x01, 0x02, 0x03, 0x81, 0x82 and 0x83 are allowed)
              ECSignature.parseScriptSignature = function (buffer) {
                var hashType = buffer.readUInt8(buffer.length - 1);
                var hashTypeMod = hashType & ~0x80;

                if (hashTypeMod <= 0x00 || hashTypeMod >= 0x04)
                  throw new Error('Invalid hashType ' + hashType);

                return {
                  signature: ECSignature.fromDER(buffer.slice(0, -1)),
                  hashType: hashType,
                };
              };

              ECSignature.prototype.toCompact = function (i, compressed) {
                if (compressed) {
                  i += 4;
                }

                i += 27;

                var buffer = Buffer.alloc(65);
                buffer.writeUInt8(i, 0);
                this.toRSBuffer(buffer, 1);
                return buffer;
              };

              ECSignature.prototype.toDER = function () {
                var r = Buffer.from(this.r.toDERInteger());
                var s = Buffer.from(this.s.toDERInteger());

                return bip66.encode(r, s);
              };

              ECSignature.prototype.toRSBuffer = function (buffer, offset) {
                buffer = buffer || Buffer.alloc(64);
                this.r.toBuffer(32).copy(buffer, offset);
                this.s.toBuffer(32).copy(buffer, offset + 32);
                return buffer;
              };

              ECSignature.prototype.toScriptSignature = function (hashType) {
                var hashTypeMod = hashType & ~0x80;
                if (hashTypeMod <= 0 || hashTypeMod >= 4)
                  throw new Error('Invalid hashType ' + hashType);

                var hashTypeBuffer = Buffer.alloc(1);
                hashTypeBuffer.writeUInt8(hashType, 0);

                return Buffer.concat([this.toDER(), hashTypeBuffer]);
              };

              module.exports = ECSignature;
            }.call(this));
          }.call(this, require('buffer').Buffer));
        },
        { './types': 128, bigi: 36, bip66: 38, buffer: 7, typeforce: 88 },
      ],
      100: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;
          var base58check = require('bs58check');
          var bcrypto = require('./crypto');
          var createHmac = require('create-hmac');
          var typeforce = require('typeforce');
          var types = require('./types');
          var NETWORKS = require('./networks');

          var BigInteger = require('bigi');
          var ECPair = require('./ecpair');

          var ecurve = require('ecurve');
          var curve = ecurve.getCurveByName('secp256k1');

          function HDNode(keyPair, chainCode) {
            typeforce(types.tuple('ECPair', types.Buffer256bit), arguments);

            if (!keyPair.compressed)
              throw new TypeError('BIP32 only allows compressed keyPairs');

            this.keyPair = keyPair;
            this.chainCode = chainCode;
            this.depth = 0;
            this.index = 0;
            this.parentFingerprint = 0x00000000;
          }

          HDNode.HIGHEST_BIT = 0x80000000;
          HDNode.LENGTH = 78;
          HDNode.MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8');

          HDNode.fromSeedBuffer = function (seed, network) {
            typeforce(
              types.tuple(types.Buffer, types.maybe(types.Network)),
              arguments
            );

            if (seed.length < 16)
              throw new TypeError('Seed should be at least 128 bits');
            if (seed.length > 64)
              throw new TypeError('Seed should be at most 512 bits');

            var I = createHmac('sha512', HDNode.MASTER_SECRET)
              .update(seed)
              .digest();
            var IL = I.slice(0, 32);
            var IR = I.slice(32);

            // In case IL is 0 or >= n, the master key is invalid
            // This is handled by the ECPair constructor
            var pIL = BigInteger.fromBuffer(IL);
            var keyPair = new ECPair(pIL, null, {
              network: network,
            });

            return new HDNode(keyPair, IR);
          };

          HDNode.fromSeedHex = function (hex, network) {
            return HDNode.fromSeedBuffer(Buffer.from(hex, 'hex'), network);
          };

          HDNode.fromBase58 = function (string, networks) {
            var buffer = base58check.decode(string);
            if (buffer.length !== 78) throw new Error('Invalid buffer length');

            // 4 bytes: version bytes
            var version = buffer.readUInt32BE(0);
            var network;

            // list of networks?
            if (Array.isArray(networks)) {
              network = networks
                .filter(function (x) {
                  return (
                    version === x.bip32.private || version === x.bip32.public
                  );
                })
                .pop();

              if (!network) throw new Error('Unknown network version');

              // otherwise, assume a network object (or default to bitcoin)
            } else {
              network = networks || NETWORKS.auroracoin;
            }

            if (
              version !== network.bip32.private &&
              version !== network.bip32.public
            )
              throw new Error('Invalid network version');

            // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ...
            var depth = buffer[4];

            // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
            var parentFingerprint = buffer.readUInt32BE(5);
            if (depth === 0) {
              if (parentFingerprint !== 0x00000000)
                throw new Error('Invalid parent fingerprint');
            }

            // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
            // This is encoded in MSB order. (0x00000000 if master key)
            var index = buffer.readUInt32BE(9);
            if (depth === 0 && index !== 0) throw new Error('Invalid index');

            // 32 bytes: the chain code
            var chainCode = buffer.slice(13, 45);
            var keyPair;

            // 33 bytes: private key data (0x00 + k)
            if (version === network.bip32.private) {
              if (buffer.readUInt8(45) !== 0x00)
                throw new Error('Invalid private key');

              var d = BigInteger.fromBuffer(buffer.slice(46, 78));
              keyPair = new ECPair(d, null, { network: network });

              // 33 bytes: public key data (0x02 + X or 0x03 + X)
            } else {
              var Q = ecurve.Point.decodeFrom(curve, buffer.slice(45, 78));
              // Q.compressed is assumed, if somehow this assumption is broken, `new HDNode` will throw

              // Verify that the X coordinate in the public point corresponds to a point on the curve.
              // If not, the extended public key is invalid.
              curve.validate(Q);

              keyPair = new ECPair(null, Q, { network: network });
            }

            var hd = new HDNode(keyPair, chainCode);
            hd.depth = depth;
            hd.index = index;
            hd.parentFingerprint = parentFingerprint;

            return hd;
          };

          HDNode.prototype.getAddress = function () {
            return this.keyPair.getAddress();
          };

          HDNode.prototype.getIdentifier = function () {
            return bcrypto.hash160(this.keyPair.getPublicKeyBuffer());
          };

          HDNode.prototype.getFingerprint = function () {
            return this.getIdentifier().slice(0, 4);
          };

          HDNode.prototype.getNetwork = function () {
            return this.keyPair.getNetwork();
          };

          HDNode.prototype.getPublicKeyBuffer = function () {
            return this.keyPair.getPublicKeyBuffer();
          };

          HDNode.prototype.neutered = function () {
            var neuteredKeyPair = new ECPair(null, this.keyPair.Q, {
              network: this.keyPair.network,
            });

            var neutered = new HDNode(neuteredKeyPair, this.chainCode);
            neutered.depth = this.depth;
            neutered.index = this.index;
            neutered.parentFingerprint = this.parentFingerprint;

            return neutered;
          };

          HDNode.prototype.sign = function (hash) {
            return this.keyPair.sign(hash);
          };

          HDNode.prototype.verify = function (hash, signature) {
            return this.keyPair.verify(hash, signature);
          };

          HDNode.prototype.toBase58 = function (__isPrivate) {
            if (__isPrivate !== undefined)
              throw new TypeError('Unsupported argument in 2.0.0');

            // Version
            var network = this.keyPair.network;
            var version = !this.isNeutered()
              ? network.bip32.private
              : network.bip32.public;
            var buffer = Buffer.allocUnsafe(78);

            // 4 bytes: version bytes
            buffer.writeUInt32BE(version, 0);

            // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ....
            buffer.writeUInt8(this.depth, 4);

            // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
            buffer.writeUInt32BE(this.parentFingerprint, 5);

            // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
            // This is encoded in big endian. (0x00000000 if master key)
            buffer.writeUInt32BE(this.index, 9);

            // 32 bytes: the chain code
            this.chainCode.copy(buffer, 13);

            // 33 bytes: the public key or private key data
            if (!this.isNeutered()) {
              // 0x00 + k for private keys
              buffer.writeUInt8(0, 45);
              this.keyPair.d.toBuffer(32).copy(buffer, 46);

              // 33 bytes: the public key
            } else {
              // X9.62 encoding for public keys
              this.keyPair.getPublicKeyBuffer().copy(buffer, 45);
            }

            return base58check.encode(buffer);
          };

          // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
          HDNode.prototype.derive = function (index) {
            typeforce(types.UInt32, index);

            var isHardened = index >= HDNode.HIGHEST_BIT;
            var data = Buffer.allocUnsafe(37);

            // Hardened child
            if (isHardened) {
              if (this.isNeutered())
                throw new TypeError('Could not derive hardened child key');

              // data = 0x00 || ser256(kpar) || ser32(index)
              data[0] = 0x00;
              this.keyPair.d.toBuffer(32).copy(data, 1);
              data.writeUInt32BE(index, 33);

              // Normal child
            } else {
              // data = serP(point(kpar)) || ser32(index)
              //      = serP(Kpar) || ser32(index)
              this.keyPair.getPublicKeyBuffer().copy(data, 0);
              data.writeUInt32BE(index, 33);
            }

            var I = createHmac('sha512', this.chainCode).update(data).digest();
            var IL = I.slice(0, 32);
            var IR = I.slice(32);

            var pIL = BigInteger.fromBuffer(IL);

            // In case parse256(IL) >= n, proceed with the next value for i
            if (pIL.compareTo(curve.n) >= 0) {
              return this.derive(index + 1);
            }

            // Private parent key -> private child key
            var derivedKeyPair;
            if (!this.isNeutered()) {
              // ki = parse256(IL) + kpar (mod n)
              var ki = pIL.add(this.keyPair.d).mod(curve.n);

              // In case ki == 0, proceed with the next value for i
              if (ki.signum() === 0) {
                return this.derive(index + 1);
              }

              derivedKeyPair = new ECPair(ki, null, {
                network: this.keyPair.network,
              });

              // Public parent key -> public child key
            } else {
              // Ki = point(parse256(IL)) + Kpar
              //    = G*IL + Kpar
              var Ki = curve.G.multiply(pIL).add(this.keyPair.Q);

              // In case Ki is the point at infinity, proceed with the next value for i
              if (curve.isInfinity(Ki)) {
                return this.derive(index + 1);
              }

              derivedKeyPair = new ECPair(null, Ki, {
                network: this.keyPair.network,
              });
            }

            var hd = new HDNode(derivedKeyPair, IR);
            hd.depth = this.depth + 1;
            hd.index = index;
            hd.parentFingerprint = this.getFingerprint().readUInt32BE(0);

            return hd;
          };

          HDNode.prototype.deriveHardened = function (index) {
            typeforce(types.UInt31, index);

            // Only derives hardened private keys by default
            return this.derive(index + HDNode.HIGHEST_BIT);
          };

          // Private === not neutered
          // Public === neutered
          HDNode.prototype.isNeutered = function () {
            return !this.keyPair.d;
          };

          HDNode.prototype.derivePath = function (path) {
            typeforce(types.BIP32Path, path);

            var splitPath = path.split('/');
            if (splitPath[0] === 'm') {
              if (this.parentFingerprint) {
                throw new Error('Not a master node');
              }

              splitPath = splitPath.slice(1);
            }

            return splitPath.reduce(function (prevHd, indexStr) {
              var index;
              if (indexStr.slice(-1) === "'") {
                index = parseInt(indexStr.slice(0, -1), 10);
                return prevHd.deriveHardened(index);
              } else {
                index = parseInt(indexStr, 10);
                return prevHd.derive(index);
              }
            }, this);
          };

          module.exports = HDNode;
        },
        {
          './crypto': 96,
          './ecpair': 98,
          './networks': 101,
          './types': 128,
          bigi: 36,
          bs58check: 43,
          'create-hmac': 47,
          ecurve: 51,
          'safe-buffer': 76,
          typeforce: 88,
        },
      ],
      101: [
        function (require, module, exports) {
          // https://en.bitcoin.it/wiki/List_of_address_prefixes
          // Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

          module.exports = {
            auroracoin: {
              messagePrefix: '\x1bAuroracoin Signed Message:\n',
              bech32: 'aur',
              bip32: {
                public: 0x0488b21e,
                private: 0x0488ade4,
              },
              pubKeyHash: 0x17,
              scriptHash: 0x05,
              wif: 0x97,
            },
            testnet: {
              messagePrefix: '\x18Bitcoin Signed Message:\n',
              bech32: 'tb',
              bip32: {
                public: 0x043587cf,
                private: 0x04358394,
              },
              pubKeyHash: 0x6f,
              scriptHash: 0xc4,
              wif: 0xef,
            },
            litecoin: {
              messagePrefix: '\x19Litecoin Signed Message:\n',
              bip32: {
                public: 0x019da462,
                private: 0x019d9cfe,
              },
              pubKeyHash: 0x30,
              scriptHash: 0x32,
              wif: 0xb0,
            },
          };
        },
        {},
      ],
      102: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;
          var bip66 = require('bip66');
          var pushdata = require('pushdata-bitcoin');
          var typeforce = require('typeforce');
          var types = require('./types');
          var scriptNumber = require('./script_number');

          var OPS = require('bitcoin-ops');
          var REVERSE_OPS = require('bitcoin-ops/map');
          var OP_INT_BASE = OPS.OP_RESERVED; // OP_1 - 1

          function isOPInt(value) {
            return (
              types.Number(value) &&
              (value === OPS.OP_0 ||
                (value >= OPS.OP_1 && value <= OPS.OP_16) ||
                value === OPS.OP_1NEGATE)
            );
          }

          function isPushOnlyChunk(value) {
            return types.Buffer(value) || isOPInt(value);
          }

          function isPushOnly(value) {
            return types.Array(value) && value.every(isPushOnlyChunk);
          }

          function asMinimalOP(buffer) {
            if (buffer.length === 0) return OPS.OP_0;
            if (buffer.length !== 1) return;
            if (buffer[0] >= 1 && buffer[0] <= 16)
              return OP_INT_BASE + buffer[0];
            if (buffer[0] === 0x81) return OPS.OP_1NEGATE;
          }

          function compile(chunks) {
            // TODO: remove me
            if (Buffer.isBuffer(chunks)) return chunks;

            typeforce(types.Array, chunks);

            var bufferSize = chunks.reduce(function (accum, chunk) {
              // data chunk
              if (Buffer.isBuffer(chunk)) {
                // adhere to BIP62.3, minimal push policy
                if (chunk.length === 1 && asMinimalOP(chunk) !== undefined) {
                  return accum + 1;
                }

                return (
                  accum + pushdata.encodingLength(chunk.length) + chunk.length
                );
              }

              // opcode
              return accum + 1;
            }, 0.0);

            var buffer = Buffer.allocUnsafe(bufferSize);
            var offset = 0;

            chunks.forEach(function (chunk) {
              // data chunk
              if (Buffer.isBuffer(chunk)) {
                // adhere to BIP62.3, minimal push policy
                var opcode = asMinimalOP(chunk);
                if (opcode !== undefined) {
                  buffer.writeUInt8(opcode, offset);
                  offset += 1;
                  return;
                }

                offset += pushdata.encode(buffer, chunk.length, offset);
                chunk.copy(buffer, offset);
                offset += chunk.length;

                // opcode
              } else {
                buffer.writeUInt8(chunk, offset);
                offset += 1;
              }
            });

            if (offset !== buffer.length)
              throw new Error('Could not decode chunks');
            return buffer;
          }

          function decompile(buffer) {
            // TODO: remove me
            if (types.Array(buffer)) return buffer;

            typeforce(types.Buffer, buffer);

            var chunks = [];
            var i = 0;

            while (i < buffer.length) {
              var opcode = buffer[i];

              // data chunk
              if (opcode > OPS.OP_0 && opcode <= OPS.OP_PUSHDATA4) {
                var d = pushdata.decode(buffer, i);

                // did reading a pushDataInt fail? empty script
                if (d === null) return [];
                i += d.size;

                // attempt to read too much data? empty script
                if (i + d.number > buffer.length) return [];

                var data = buffer.slice(i, i + d.number);
                i += d.number;

                // decompile minimally
                var op = asMinimalOP(data);
                if (op !== undefined) {
                  chunks.push(op);
                } else {
                  chunks.push(data);
                }

                // opcode
              } else {
                chunks.push(opcode);

                i += 1;
              }
            }

            return chunks;
          }

          function toASM(chunks) {
            if (Buffer.isBuffer(chunks)) {
              chunks = decompile(chunks);
            }

            return chunks
              .map(function (chunk) {
                // data?
                if (Buffer.isBuffer(chunk)) {
                  var op = asMinimalOP(chunk);
                  if (op === undefined) return chunk.toString('hex');
                  chunk = op;
                }

                // opcode!
                return REVERSE_OPS[chunk];
              })
              .join(' ');
          }

          function fromASM(asm) {
            typeforce(types.String, asm);

            return compile(
              asm.split(' ').map(function (chunkStr) {
                // opcode?
                if (OPS[chunkStr] !== undefined) return OPS[chunkStr];
                typeforce(types.Hex, chunkStr);

                // data!
                return Buffer.from(chunkStr, 'hex');
              })
            );
          }

          function toStack(chunks) {
            chunks = decompile(chunks);
            typeforce(isPushOnly, chunks);

            return chunks.map(function (op) {
              if (Buffer.isBuffer(op)) return op;
              if (op === OPS.OP_0) return Buffer.allocUnsafe(0);

              return scriptNumber.encode(op - OP_INT_BASE);
            });
          }

          function isCanonicalPubKey(buffer) {
            if (!Buffer.isBuffer(buffer)) return false;
            if (buffer.length < 33) return false;

            switch (buffer[0]) {
              case 0x02:
              case 0x03:
                return buffer.length === 33;
              case 0x04:
                return buffer.length === 65;
            }

            return false;
          }

          function isDefinedHashType(hashType) {
            var hashTypeMod = hashType & ~0x80;

            // return hashTypeMod > SIGHASH_ALL && hashTypeMod < SIGHASH_SINGLE
            return hashTypeMod > 0x00 && hashTypeMod < 0x04;
          }

          function isCanonicalSignature(buffer) {
            if (!Buffer.isBuffer(buffer)) return false;
            if (!isDefinedHashType(buffer[buffer.length - 1])) return false;

            return bip66.check(buffer.slice(0, -1));
          }

          module.exports = {
            compile: compile,
            decompile: decompile,
            fromASM: fromASM,
            toASM: toASM,
            toStack: toStack,

            number: require('./script_number'),

            isCanonicalPubKey: isCanonicalPubKey,
            isCanonicalSignature: isCanonicalSignature,
            isPushOnly: isPushOnly,
            isDefinedHashType: isDefinedHashType,
          };
        },
        {
          './script_number': 103,
          './types': 128,
          bip66: 38,
          'bitcoin-ops': 39,
          'bitcoin-ops/map': 40,
          'pushdata-bitcoin': 58,
          'safe-buffer': 76,
          typeforce: 88,
        },
      ],
      103: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;

          function decode(buffer, maxLength, minimal) {
            maxLength = maxLength || 4;
            minimal = minimal === undefined ? true : minimal;

            var length = buffer.length;
            if (length === 0) return 0;
            if (length > maxLength)
              throw new TypeError('Script number overflow');
            if (minimal) {
              if ((buffer[length - 1] & 0x7f) === 0) {
                if (length <= 1 || (buffer[length - 2] & 0x80) === 0)
                  throw new Error('Non-minimally encoded script number');
              }
            }

            // 40-bit
            if (length === 5) {
              var a = buffer.readUInt32LE(0);
              var b = buffer.readUInt8(4);

              if (b & 0x80) return -((b & ~0x80) * 0x100000000 + a);
              return b * 0x100000000 + a;
            }

            var result = 0;

            // 32-bit / 24-bit / 16-bit / 8-bit
            for (var i = 0; i < length; ++i) {
              result |= buffer[i] << (8 * i);
            }

            if (buffer[length - 1] & 0x80)
              return -(result & ~(0x80 << (8 * (length - 1))));
            return result;
          }

          function scriptNumSize(i) {
            return i > 0x7fffffff
              ? 5
              : i > 0x7fffff
              ? 4
              : i > 0x7fff
              ? 3
              : i > 0x7f
              ? 2
              : i > 0x00
              ? 1
              : 0;
          }

          function encode(number) {
            var value = Math.abs(number);
            var size = scriptNumSize(value);
            var buffer = Buffer.allocUnsafe(size);
            var negative = number < 0;

            for (var i = 0; i < size; ++i) {
              buffer.writeUInt8(value & 0xff, i);
              value >>= 8;
            }

            if (buffer[size - 1] & 0x80) {
              buffer.writeUInt8(negative ? 0x80 : 0x00, size - 1);
            } else if (negative) {
              buffer[size - 1] |= 0x80;
            }

            return buffer;
          }

          module.exports = {
            decode: decode,
            encode: encode,
          };
        },
        { 'safe-buffer': 76 },
      ],
      104: [
        function (require, module, exports) {
          var decompile = require('../script').decompile;
          var multisig = require('./multisig');
          var nullData = require('./nulldata');
          var pubKey = require('./pubkey');
          var pubKeyHash = require('./pubkeyhash');
          var scriptHash = require('./scripthash');
          var witnessPubKeyHash = require('./witnesspubkeyhash');
          var witnessScriptHash = require('./witnessscripthash');
          var witnessCommitment = require('./witnesscommitment');

          var types = {
            MULTISIG: 'multisig',
            NONSTANDARD: 'nonstandard',
            NULLDATA: 'nulldata',
            P2PK: 'pubkey',
            P2PKH: 'pubkeyhash',
            P2SH: 'scripthash',
            P2WPKH: 'witnesspubkeyhash',
            P2WSH: 'witnessscripthash',
            WITNESS_COMMITMENT: 'witnesscommitment',
          };

          function classifyOutput(script) {
            if (witnessPubKeyHash.output.check(script)) return types.P2WPKH;
            if (witnessScriptHash.output.check(script)) return types.P2WSH;
            if (pubKeyHash.output.check(script)) return types.P2PKH;
            if (scriptHash.output.check(script)) return types.P2SH;

            // XXX: optimization, below functions .decompile before use
            var chunks = decompile(script);
            if (multisig.output.check(chunks)) return types.MULTISIG;
            if (pubKey.output.check(chunks)) return types.P2PK;
            if (witnessCommitment.output.check(chunks))
              return types.WITNESS_COMMITMENT;
            if (nullData.output.check(chunks)) return types.NULLDATA;

            return types.NONSTANDARD;
          }

          function classifyInput(script, allowIncomplete) {
            // XXX: optimization, below functions .decompile before use
            var chunks = decompile(script);

            if (pubKeyHash.input.check(chunks)) return types.P2PKH;
            if (scriptHash.input.check(chunks, allowIncomplete))
              return types.P2SH;
            if (multisig.input.check(chunks, allowIncomplete))
              return types.MULTISIG;
            if (pubKey.input.check(chunks)) return types.P2PK;

            return types.NONSTANDARD;
          }

          function classifyWitness(script, allowIncomplete) {
            // XXX: optimization, below functions .decompile before use
            var chunks = decompile(script);

            if (witnessPubKeyHash.input.check(chunks)) return types.P2WPKH;
            if (witnessScriptHash.input.check(chunks, allowIncomplete))
              return types.P2WSH;

            return types.NONSTANDARD;
          }

          module.exports = {
            classifyInput: classifyInput,
            classifyOutput: classifyOutput,
            classifyWitness: classifyWitness,
            multisig: multisig,
            nullData: nullData,
            pubKey: pubKey,
            pubKeyHash: pubKeyHash,
            scriptHash: scriptHash,
            witnessPubKeyHash: witnessPubKeyHash,
            witnessScriptHash: witnessScriptHash,
            witnessCommitment: witnessCommitment,
            types: types,
          };
        },
        {
          '../script': 102,
          './multisig': 105,
          './nulldata': 108,
          './pubkey': 109,
          './pubkeyhash': 112,
          './scripthash': 115,
          './witnesscommitment': 118,
          './witnesspubkeyhash': 120,
          './witnessscripthash': 123,
        },
      ],
      105: [
        function (require, module, exports) {
          module.exports = {
            input: require('./input'),
            output: require('./output'),
          };
        },
        { './input': 106, './output': 107 },
      ],
      106: [
        function (require, module, exports) {
          // OP_0 [signatures ...]

          var Buffer = require('safe-buffer').Buffer;
          var bscript = require('../../script');
          var p2mso = require('./output');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');

          function partialSignature(value) {
            return value === OPS.OP_0 || bscript.isCanonicalSignature(value);
          }

          function check(script, allowIncomplete) {
            var chunks = bscript.decompile(script);
            if (chunks.length < 2) return false;
            if (chunks[0] !== OPS.OP_0) return false;

            if (allowIncomplete) {
              return chunks.slice(1).every(partialSignature);
            }

            return chunks.slice(1).every(bscript.isCanonicalSignature);
          }
          check.toJSON = function () {
            return 'multisig input';
          };

          var EMPTY_BUFFER = Buffer.allocUnsafe(0);

          function encodeStack(signatures, scriptPubKey) {
            typeforce([partialSignature], signatures);

            if (scriptPubKey) {
              var scriptData = p2mso.decode(scriptPubKey);

              if (signatures.length < scriptData.m) {
                throw new TypeError('Not enough signatures provided');
              }

              if (signatures.length > scriptData.pubKeys.length) {
                throw new TypeError('Too many signatures provided');
              }
            }

            return [].concat(
              EMPTY_BUFFER,
              signatures.map(function (sig) {
                if (sig === OPS.OP_0) {
                  return EMPTY_BUFFER;
                }
                return sig;
              })
            );
          }

          function encode(signatures, scriptPubKey) {
            return bscript.compile(encodeStack(signatures, scriptPubKey));
          }

          function decodeStack(stack, allowIncomplete) {
            typeforce(typeforce.Array, stack);
            typeforce(check, stack, allowIncomplete);
            return stack.slice(1);
          }

          function decode(buffer, allowIncomplete) {
            var stack = bscript.decompile(buffer);
            return decodeStack(stack, allowIncomplete);
          }

          module.exports = {
            check: check,
            decode: decode,
            decodeStack: decodeStack,
            encode: encode,
            encodeStack: encodeStack,
          };
        },
        {
          '../../script': 102,
          './output': 107,
          'bitcoin-ops': 39,
          'safe-buffer': 76,
          typeforce: 88,
        },
      ],
      107: [
        function (require, module, exports) {
          // m [pubKeys ...] n OP_CHECKMULTISIG

          var bscript = require('../../script');
          var types = require('../../types');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');
          var OP_INT_BASE = OPS.OP_RESERVED; // OP_1 - 1

          function check(script, allowIncomplete) {
            var chunks = bscript.decompile(script);

            if (chunks.length < 4) return false;
            if (chunks[chunks.length - 1] !== OPS.OP_CHECKMULTISIG)
              return false;
            if (!types.Number(chunks[0])) return false;
            if (!types.Number(chunks[chunks.length - 2])) return false;
            var m = chunks[0] - OP_INT_BASE;
            var n = chunks[chunks.length - 2] - OP_INT_BASE;

            if (m <= 0) return false;
            if (n > 16) return false;
            if (m > n) return false;
            if (n !== chunks.length - 3) return false;
            if (allowIncomplete) return true;

            var keys = chunks.slice(1, -2);
            return keys.every(bscript.isCanonicalPubKey);
          }
          check.toJSON = function () {
            return 'multi-sig output';
          };

          function encode(m, pubKeys) {
            typeforce(
              {
                m: types.Number,
                pubKeys: [bscript.isCanonicalPubKey],
              },
              {
                m: m,
                pubKeys: pubKeys,
              }
            );

            var n = pubKeys.length;
            if (n < m) throw new TypeError('Not enough pubKeys provided');

            return bscript.compile(
              [].concat(
                OP_INT_BASE + m,
                pubKeys,
                OP_INT_BASE + n,
                OPS.OP_CHECKMULTISIG
              )
            );
          }

          function decode(buffer, allowIncomplete) {
            var chunks = bscript.decompile(buffer);
            typeforce(check, chunks, allowIncomplete);

            return {
              m: chunks[0] - OP_INT_BASE,
              pubKeys: chunks.slice(1, -2),
            };
          }

          module.exports = {
            check: check,
            decode: decode,
            encode: encode,
          };
        },
        {
          '../../script': 102,
          '../../types': 128,
          'bitcoin-ops': 39,
          typeforce: 88,
        },
      ],
      108: [
        function (require, module, exports) {
          // OP_RETURN {data}

          var bscript = require('../script');
          var types = require('../types');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');

          function check(script) {
            var buffer = bscript.compile(script);

            return buffer.length > 1 && buffer[0] === OPS.OP_RETURN;
          }
          check.toJSON = function () {
            return 'null data output';
          };

          function encode(data) {
            typeforce(types.Buffer, data);

            return bscript.compile([OPS.OP_RETURN, data]);
          }

          function decode(buffer) {
            typeforce(check, buffer);

            return buffer.slice(2);
          }

          module.exports = {
            output: {
              check: check,
              decode: decode,
              encode: encode,
            },
          };
        },
        { '../script': 102, '../types': 128, 'bitcoin-ops': 39, typeforce: 88 },
      ],
      109: [
        function (require, module, exports) {
          arguments[4][105][0].apply(exports, arguments);
        },
        { './input': 110, './output': 111, dup: 105 },
      ],
      110: [
        function (require, module, exports) {
          // {signature}

          var bscript = require('../../script');
          var typeforce = require('typeforce');

          function check(script) {
            var chunks = bscript.decompile(script);

            return (
              chunks.length === 1 && bscript.isCanonicalSignature(chunks[0])
            );
          }
          check.toJSON = function () {
            return 'pubKey input';
          };

          function encodeStack(signature) {
            typeforce(bscript.isCanonicalSignature, signature);
            return [signature];
          }

          function encode(signature) {
            return bscript.compile(encodeStack(signature));
          }

          function decodeStack(stack) {
            typeforce(typeforce.Array, stack);
            typeforce(check, stack);
            return stack[0];
          }

          function decode(buffer) {
            var stack = bscript.decompile(buffer);
            return decodeStack(stack);
          }

          module.exports = {
            check: check,
            decode: decode,
            decodeStack: decodeStack,
            encode: encode,
            encodeStack: encodeStack,
          };
        },
        { '../../script': 102, typeforce: 88 },
      ],
      111: [
        function (require, module, exports) {
          // {pubKey} OP_CHECKSIG

          var bscript = require('../../script');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');

          function check(script) {
            var chunks = bscript.decompile(script);

            return (
              chunks.length === 2 &&
              bscript.isCanonicalPubKey(chunks[0]) &&
              chunks[1] === OPS.OP_CHECKSIG
            );
          }
          check.toJSON = function () {
            return 'pubKey output';
          };

          function encode(pubKey) {
            typeforce(bscript.isCanonicalPubKey, pubKey);

            return bscript.compile([pubKey, OPS.OP_CHECKSIG]);
          }

          function decode(buffer) {
            var chunks = bscript.decompile(buffer);
            typeforce(check, chunks);

            return chunks[0];
          }

          module.exports = {
            check: check,
            decode: decode,
            encode: encode,
          };
        },
        { '../../script': 102, 'bitcoin-ops': 39, typeforce: 88 },
      ],
      112: [
        function (require, module, exports) {
          arguments[4][105][0].apply(exports, arguments);
        },
        { './input': 113, './output': 114, dup: 105 },
      ],
      113: [
        function (require, module, exports) {
          // {signature} {pubKey}

          var bscript = require('../../script');
          var typeforce = require('typeforce');

          function check(script) {
            var chunks = bscript.decompile(script);

            return (
              chunks.length === 2 &&
              bscript.isCanonicalSignature(chunks[0]) &&
              bscript.isCanonicalPubKey(chunks[1])
            );
          }
          check.toJSON = function () {
            return 'pubKeyHash input';
          };

          function encodeStack(signature, pubKey) {
            typeforce(
              {
                signature: bscript.isCanonicalSignature,
                pubKey: bscript.isCanonicalPubKey,
              },
              {
                signature: signature,
                pubKey: pubKey,
              }
            );

            return [signature, pubKey];
          }

          function encode(signature, pubKey) {
            return bscript.compile(encodeStack(signature, pubKey));
          }

          function decodeStack(stack) {
            typeforce(typeforce.Array, stack);
            typeforce(check, stack);

            return {
              signature: stack[0],
              pubKey: stack[1],
            };
          }

          function decode(buffer) {
            var stack = bscript.decompile(buffer);
            return decodeStack(stack);
          }

          module.exports = {
            check: check,
            decode: decode,
            decodeStack: decodeStack,
            encode: encode,
            encodeStack: encodeStack,
          };
        },
        { '../../script': 102, typeforce: 88 },
      ],
      114: [
        function (require, module, exports) {
          // OP_DUP OP_HASH160 {pubKeyHash} OP_EQUALVERIFY OP_CHECKSIG

          var bscript = require('../../script');
          var types = require('../../types');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');

          function check(script) {
            var buffer = bscript.compile(script);

            return (
              buffer.length === 25 &&
              buffer[0] === OPS.OP_DUP &&
              buffer[1] === OPS.OP_HASH160 &&
              buffer[2] === 0x14 &&
              buffer[23] === OPS.OP_EQUALVERIFY &&
              buffer[24] === OPS.OP_CHECKSIG
            );
          }
          check.toJSON = function () {
            return 'pubKeyHash output';
          };

          function encode(pubKeyHash) {
            typeforce(types.Hash160bit, pubKeyHash);

            return bscript.compile([
              OPS.OP_DUP,
              OPS.OP_HASH160,
              pubKeyHash,
              OPS.OP_EQUALVERIFY,
              OPS.OP_CHECKSIG,
            ]);
          }

          function decode(buffer) {
            typeforce(check, buffer);

            return buffer.slice(3, 23);
          }

          module.exports = {
            check: check,
            decode: decode,
            encode: encode,
          };
        },
        {
          '../../script': 102,
          '../../types': 128,
          'bitcoin-ops': 39,
          typeforce: 88,
        },
      ],
      115: [
        function (require, module, exports) {
          arguments[4][105][0].apply(exports, arguments);
        },
        { './input': 116, './output': 117, dup: 105 },
      ],
      116: [
        function (require, module, exports) {
          // <scriptSig> {serialized scriptPubKey script}

          var Buffer = require('safe-buffer').Buffer;
          var bscript = require('../../script');
          var typeforce = require('typeforce');

          var p2ms = require('../multisig/');
          var p2pk = require('../pubkey/');
          var p2pkh = require('../pubkeyhash/');
          var p2wpkho = require('../witnesspubkeyhash/output');
          var p2wsho = require('../witnessscripthash/output');

          function check(script, allowIncomplete) {
            var chunks = bscript.decompile(script);
            if (chunks.length < 1) return false;

            var lastChunk = chunks[chunks.length - 1];
            if (!Buffer.isBuffer(lastChunk)) return false;

            var scriptSigChunks = bscript.decompile(
              bscript.compile(chunks.slice(0, -1))
            );
            var redeemScriptChunks = bscript.decompile(lastChunk);

            // is redeemScript a valid script?
            if (redeemScriptChunks.length === 0) return false;

            // is redeemScriptSig push only?
            if (!bscript.isPushOnly(scriptSigChunks)) return false;

            // is witness?
            if (chunks.length === 1) {
              return (
                p2wsho.check(redeemScriptChunks) ||
                p2wpkho.check(redeemScriptChunks)
              );
            }

            // match types
            if (
              p2pkh.input.check(scriptSigChunks) &&
              p2pkh.output.check(redeemScriptChunks)
            )
              return true;

            if (
              p2ms.input.check(scriptSigChunks, allowIncomplete) &&
              p2ms.output.check(redeemScriptChunks)
            )
              return true;

            if (
              p2pk.input.check(scriptSigChunks) &&
              p2pk.output.check(redeemScriptChunks)
            )
              return true;

            return false;
          }
          check.toJSON = function () {
            return 'scriptHash input';
          };

          function encodeStack(redeemScriptStack, redeemScript) {
            var serializedScriptPubKey = bscript.compile(redeemScript);

            return [].concat(redeemScriptStack, serializedScriptPubKey);
          }

          function encode(redeemScriptSig, redeemScript) {
            var redeemScriptStack = bscript.decompile(redeemScriptSig);

            return bscript.compile(
              encodeStack(redeemScriptStack, redeemScript)
            );
          }

          function decodeStack(stack) {
            typeforce(typeforce.Array, stack);
            typeforce(check, stack);

            return {
              redeemScriptStack: stack.slice(0, -1),
              redeemScript: stack[stack.length - 1],
            };
          }

          function decode(buffer) {
            var stack = bscript.decompile(buffer);
            var result = decodeStack(stack);
            result.redeemScriptSig = bscript.compile(result.redeemScriptStack);
            delete result.redeemScriptStack;
            return result;
          }

          module.exports = {
            check: check,
            decode: decode,
            decodeStack: decodeStack,
            encode: encode,
            encodeStack: encodeStack,
          };
        },
        {
          '../../script': 102,
          '../multisig/': 105,
          '../pubkey/': 109,
          '../pubkeyhash/': 112,
          '../witnesspubkeyhash/output': 122,
          '../witnessscripthash/output': 125,
          'safe-buffer': 76,
          typeforce: 88,
        },
      ],
      117: [
        function (require, module, exports) {
          // OP_HASH160 {scriptHash} OP_EQUAL

          var bscript = require('../../script');
          var types = require('../../types');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');

          function check(script) {
            var buffer = bscript.compile(script);

            return (
              buffer.length === 23 &&
              buffer[0] === OPS.OP_HASH160 &&
              buffer[1] === 0x14 &&
              buffer[22] === OPS.OP_EQUAL
            );
          }
          check.toJSON = function () {
            return 'scriptHash output';
          };

          function encode(scriptHash) {
            typeforce(types.Hash160bit, scriptHash);

            return bscript.compile([OPS.OP_HASH160, scriptHash, OPS.OP_EQUAL]);
          }

          function decode(buffer) {
            typeforce(check, buffer);

            return buffer.slice(2, 22);
          }

          module.exports = {
            check: check,
            decode: decode,
            encode: encode,
          };
        },
        {
          '../../script': 102,
          '../../types': 128,
          'bitcoin-ops': 39,
          typeforce: 88,
        },
      ],
      118: [
        function (require, module, exports) {
          module.exports = {
            output: require('./output'),
          };
        },
        { './output': 119 },
      ],
      119: [
        function (require, module, exports) {
          // OP_RETURN {aa21a9ed} {commitment}

          var Buffer = require('safe-buffer').Buffer;
          var bscript = require('../../script');
          var types = require('../../types');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');

          var HEADER = Buffer.from('aa21a9ed', 'hex');

          function check(script) {
            var buffer = bscript.compile(script);

            return (
              buffer.length > 37 &&
              buffer[0] === OPS.OP_RETURN &&
              buffer[1] === 0x24 &&
              buffer.slice(2, 6).equals(HEADER)
            );
          }

          check.toJSON = function () {
            return 'Witness commitment output';
          };

          function encode(commitment) {
            typeforce(types.Hash256bit, commitment);

            var buffer = Buffer.allocUnsafe(36);
            HEADER.copy(buffer, 0);
            commitment.copy(buffer, 4);

            return bscript.compile([OPS.OP_RETURN, buffer]);
          }

          function decode(buffer) {
            typeforce(check, buffer);

            return bscript.decompile(buffer)[1].slice(4, 36);
          }

          module.exports = {
            check: check,
            decode: decode,
            encode: encode,
          };
        },
        {
          '../../script': 102,
          '../../types': 128,
          'bitcoin-ops': 39,
          'safe-buffer': 76,
          typeforce: 88,
        },
      ],
      120: [
        function (require, module, exports) {
          arguments[4][105][0].apply(exports, arguments);
        },
        { './input': 121, './output': 122, dup: 105 },
      ],
      121: [
        function (require, module, exports) {
          // {signature} {pubKey}

          var bscript = require('../../script');
          var typeforce = require('typeforce');

          function isCompressedCanonicalPubKey(pubKey) {
            return bscript.isCanonicalPubKey(pubKey) && pubKey.length === 33;
          }

          function check(script) {
            var chunks = bscript.decompile(script);

            return (
              chunks.length === 2 &&
              bscript.isCanonicalSignature(chunks[0]) &&
              isCompressedCanonicalPubKey(chunks[1])
            );
          }
          check.toJSON = function () {
            return 'witnessPubKeyHash input';
          };

          function encodeStack(signature, pubKey) {
            typeforce(
              {
                signature: bscript.isCanonicalSignature,
                pubKey: isCompressedCanonicalPubKey,
              },
              {
                signature: signature,
                pubKey: pubKey,
              }
            );

            return [signature, pubKey];
          }

          function decodeStack(stack) {
            typeforce(typeforce.Array, stack);
            typeforce(check, stack);

            return {
              signature: stack[0],
              pubKey: stack[1],
            };
          }

          module.exports = {
            check: check,
            decodeStack: decodeStack,
            encodeStack: encodeStack,
          };
        },
        { '../../script': 102, typeforce: 88 },
      ],
      122: [
        function (require, module, exports) {
          // OP_0 {pubKeyHash}

          var bscript = require('../../script');
          var types = require('../../types');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');

          function check(script) {
            var buffer = bscript.compile(script);

            return (
              buffer.length === 22 &&
              buffer[0] === OPS.OP_0 &&
              buffer[1] === 0x14
            );
          }
          check.toJSON = function () {
            return 'Witness pubKeyHash output';
          };

          function encode(pubKeyHash) {
            typeforce(types.Hash160bit, pubKeyHash);

            return bscript.compile([OPS.OP_0, pubKeyHash]);
          }

          function decode(buffer) {
            typeforce(check, buffer);

            return buffer.slice(2);
          }

          module.exports = {
            check: check,
            decode: decode,
            encode: encode,
          };
        },
        {
          '../../script': 102,
          '../../types': 128,
          'bitcoin-ops': 39,
          typeforce: 88,
        },
      ],
      123: [
        function (require, module, exports) {
          arguments[4][105][0].apply(exports, arguments);
        },
        { './input': 124, './output': 125, dup: 105 },
      ],
      124: [
        function (require, module, exports) {
          (function (Buffer) {
            (function () {
              // <scriptSig> {serialized scriptPubKey script}

              var bscript = require('../../script');
              var types = require('../../types');
              var typeforce = require('typeforce');

              var p2ms = require('../multisig/');
              var p2pk = require('../pubkey/');
              var p2pkh = require('../pubkeyhash/');

              function check(chunks, allowIncomplete) {
                typeforce(types.Array, chunks);
                if (chunks.length < 1) return false;

                var witnessScript = chunks[chunks.length - 1];
                if (!Buffer.isBuffer(witnessScript)) return false;

                var witnessScriptChunks = bscript.decompile(witnessScript);

                // is witnessScript a valid script?
                if (witnessScriptChunks.length === 0) return false;

                var witnessRawScriptSig = bscript.compile(chunks.slice(0, -1));

                // match types
                if (
                  p2pkh.input.check(witnessRawScriptSig) &&
                  p2pkh.output.check(witnessScriptChunks)
                )
                  return true;

                if (
                  p2ms.input.check(witnessRawScriptSig, allowIncomplete) &&
                  p2ms.output.check(witnessScriptChunks)
                )
                  return true;

                if (
                  p2pk.input.check(witnessRawScriptSig) &&
                  p2pk.output.check(witnessScriptChunks)
                )
                  return true;

                return false;
              }
              check.toJSON = function () {
                return 'witnessScriptHash input';
              };

              function encodeStack(witnessData, witnessScript) {
                typeforce(
                  {
                    witnessData: [types.Buffer],
                    witnessScript: types.Buffer,
                  },
                  {
                    witnessData: witnessData,
                    witnessScript: witnessScript,
                  }
                );

                return [].concat(witnessData, witnessScript);
              }

              function decodeStack(stack) {
                typeforce(typeforce.Array, stack);
                typeforce(check, stack);
                return {
                  witnessData: stack.slice(0, -1),
                  witnessScript: stack[stack.length - 1],
                };
              }

              module.exports = {
                check: check,
                decodeStack: decodeStack,
                encodeStack: encodeStack,
              };
            }.call(this));
          }.call(this, {
            isBuffer: require('C:/Users/mikki/AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js'),
          }));
        },
        {
          '../../script': 102,
          '../../types': 128,
          '../multisig/': 105,
          '../pubkey/': 109,
          '../pubkeyhash/': 112,
          'C:/Users/mikki/AppData/Roaming/npm/node_modules/browserify/node_modules/is-buffer/index.js': 11,
          typeforce: 88,
        },
      ],
      125: [
        function (require, module, exports) {
          // OP_0 {scriptHash}

          var bscript = require('../../script');
          var types = require('../../types');
          var typeforce = require('typeforce');
          var OPS = require('bitcoin-ops');

          function check(script) {
            var buffer = bscript.compile(script);

            return (
              buffer.length === 34 &&
              buffer[0] === OPS.OP_0 &&
              buffer[1] === 0x20
            );
          }
          check.toJSON = function () {
            return 'Witness scriptHash output';
          };

          function encode(scriptHash) {
            typeforce(types.Hash256bit, scriptHash);

            return bscript.compile([OPS.OP_0, scriptHash]);
          }

          function decode(buffer) {
            typeforce(check, buffer);

            return buffer.slice(2);
          }

          module.exports = {
            check: check,
            decode: decode,
            encode: encode,
          };
        },
        {
          '../../script': 102,
          '../../types': 128,
          'bitcoin-ops': 39,
          typeforce: 88,
        },
      ],
      126: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;
          var bcrypto = require('./crypto');
          var bscript = require('./script');
          var bufferutils = require('./bufferutils');
          var opcodes = require('bitcoin-ops');
          var typeforce = require('typeforce');
          var types = require('./types');
          var varuint = require('varuint-bitcoin');

          function varSliceSize(someScript) {
            var length = someScript.length;

            return varuint.encodingLength(length) + length;
          }

          function vectorSize(someVector) {
            var length = someVector.length;

            return (
              varuint.encodingLength(length) +
              someVector.reduce(function (sum, witness) {
                return sum + varSliceSize(witness);
              }, 0)
            );
          }

          function Transaction() {
            this.version = 1;
            this.locktime = 0;
            this.ins = [];
            this.outs = [];
          }

          Transaction.DEFAULT_SEQUENCE = 0xffffffff;
          Transaction.SIGHASH_ALL = 0x01;
          Transaction.SIGHASH_NONE = 0x02;
          Transaction.SIGHASH_SINGLE = 0x03;
          Transaction.SIGHASH_ANYONECANPAY = 0x80;
          Transaction.ADVANCED_TRANSACTION_MARKER = 0x00;
          Transaction.ADVANCED_TRANSACTION_FLAG = 0x01;

          var EMPTY_SCRIPT = Buffer.allocUnsafe(0);
          var EMPTY_WITNESS = [];
          var ZERO = Buffer.from(
            '0000000000000000000000000000000000000000000000000000000000000000',
            'hex'
          );
          var ONE = Buffer.from(
            '0000000000000000000000000000000000000000000000000000000000000001',
            'hex'
          );
          var VALUE_UINT64_MAX = Buffer.from('ffffffffffffffff', 'hex');
          var BLANK_OUTPUT = {
            script: EMPTY_SCRIPT,
            valueBuffer: VALUE_UINT64_MAX,
          };

          Transaction.fromBuffer = function (buffer, __noStrict) {
            var offset = 0;
            function readSlice(n) {
              offset += n;
              return buffer.slice(offset - n, offset);
            }

            function readUInt32() {
              var i = buffer.readUInt32LE(offset);
              offset += 4;
              return i;
            }

            function readInt32() {
              var i = buffer.readInt32LE(offset);
              offset += 4;
              return i;
            }

            function readUInt64() {
              var i = bufferutils.readUInt64LE(buffer, offset);
              offset += 8;
              return i;
            }

            function readVarInt() {
              var vi = varuint.decode(buffer, offset);
              offset += varuint.decode.bytes;
              return vi;
            }

            function readVarSlice() {
              return readSlice(readVarInt());
            }

            function readVector() {
              var count = readVarInt();
              var vector = [];
              for (var i = 0; i < count; i++) vector.push(readVarSlice());
              return vector;
            }

            var tx = new Transaction();
            tx.version = readInt32();

            var marker = buffer.readUInt8(offset);
            var flag = buffer.readUInt8(offset + 1);

            var hasWitnesses = false;
            if (
              marker === Transaction.ADVANCED_TRANSACTION_MARKER &&
              flag === Transaction.ADVANCED_TRANSACTION_FLAG
            ) {
              offset += 2;
              hasWitnesses = true;
            }

            var vinLen = readVarInt();
            for (var i = 0; i < vinLen; ++i) {
              tx.ins.push({
                hash: readSlice(32),
                index: readUInt32(),
                script: readVarSlice(),
                sequence: readUInt32(),
                witness: EMPTY_WITNESS,
              });
            }

            var voutLen = readVarInt();
            for (i = 0; i < voutLen; ++i) {
              tx.outs.push({
                value: readUInt64(),
                script: readVarSlice(),
              });
            }

            if (hasWitnesses) {
              for (i = 0; i < vinLen; ++i) {
                tx.ins[i].witness = readVector();
              }

              // was this pointless?
              if (!tx.hasWitnesses())
                throw new Error('Transaction has superfluous witness data');
            }

            tx.locktime = readUInt32();

            if (__noStrict) return tx;
            if (offset !== buffer.length)
              throw new Error('Transaction has unexpected data');

            return tx;
          };

          Transaction.fromHex = function (hex) {
            return Transaction.fromBuffer(Buffer.from(hex, 'hex'));
          };

          Transaction.isCoinbaseHash = function (buffer) {
            typeforce(types.Hash256bit, buffer);
            for (var i = 0; i < 32; ++i) {
              if (buffer[i] !== 0) return false;
            }
            return true;
          };

          Transaction.prototype.isCoinbase = function () {
            return (
              this.ins.length === 1 &&
              Transaction.isCoinbaseHash(this.ins[0].hash)
            );
          };

          Transaction.prototype.addInput = function (
            hash,
            index,
            sequence,
            scriptSig
          ) {
            typeforce(
              types.tuple(
                types.Hash256bit,
                types.UInt32,
                types.maybe(types.UInt32),
                types.maybe(types.Buffer)
              ),
              arguments
            );

            if (types.Null(sequence)) {
              sequence = Transaction.DEFAULT_SEQUENCE;
            }

            // Add the input and return the input's index
            return (
              this.ins.push({
                hash: hash,
                index: index,
                script: scriptSig || EMPTY_SCRIPT,
                sequence: sequence,
                witness: EMPTY_WITNESS,
              }) - 1
            );
          };

          Transaction.prototype.addOutput = function (scriptPubKey, value) {
            typeforce(types.tuple(types.Buffer, types.Satoshi), arguments);

            // Add the output and return the output's index
            return (
              this.outs.push({
                script: scriptPubKey,
                value: value,
              }) - 1
            );
          };

          Transaction.prototype.hasWitnesses = function () {
            return this.ins.some(function (x) {
              return x.witness.length !== 0;
            });
          };

          Transaction.prototype.weight = function () {
            var base = this.__byteLength(false);
            var total = this.__byteLength(true);
            return base * 3 + total;
          };

          Transaction.prototype.virtualSize = function () {
            return Math.ceil(this.weight() / 4);
          };

          Transaction.prototype.byteLength = function () {
            return this.__byteLength(true);
          };

          Transaction.prototype.__byteLength = function (__allowWitness) {
            var hasWitnesses = __allowWitness && this.hasWitnesses();

            return (
              (hasWitnesses ? 10 : 8) +
              varuint.encodingLength(this.ins.length) +
              varuint.encodingLength(this.outs.length) +
              this.ins.reduce(function (sum, input) {
                return sum + 40 + varSliceSize(input.script);
              }, 0) +
              this.outs.reduce(function (sum, output) {
                return sum + 8 + varSliceSize(output.script);
              }, 0) +
              (hasWitnesses
                ? this.ins.reduce(function (sum, input) {
                    return sum + vectorSize(input.witness);
                  }, 0)
                : 0)
            );
          };

          Transaction.prototype.clone = function () {
            var newTx = new Transaction();
            newTx.version = this.version;
            newTx.locktime = this.locktime;

            newTx.ins = this.ins.map(function (txIn) {
              return {
                hash: txIn.hash,
                index: txIn.index,
                script: txIn.script,
                sequence: txIn.sequence,
                witness: txIn.witness,
              };
            });

            newTx.outs = this.outs.map(function (txOut) {
              return {
                script: txOut.script,
                value: txOut.value,
              };
            });

            return newTx;
          };

          /**
           * Hash transaction for signing a specific input.
           *
           * Bitcoin uses a different hash for each signed transaction input.
           * This method copies the transaction, makes the necessary changes based on the
           * hashType, and then hashes the result.
           * This hash can then be used to sign the provided transaction input.
           */
          Transaction.prototype.hashForSignature = function (
            inIndex,
            prevOutScript,
            hashType
          ) {
            typeforce(
              types.tuple(
                types.UInt32,
                types.Buffer,
                /* types.UInt8 */ types.Number
              ),
              arguments
            );

            // https://github.com/bitcoin/bitcoin/blob/master/src/test/sighash_tests.cpp#L29
            if (inIndex >= this.ins.length) return ONE;

            // ignore OP_CODESEPARATOR
            var ourScript = bscript.compile(
              bscript.decompile(prevOutScript).filter(function (x) {
                return x !== opcodes.OP_CODESEPARATOR;
              })
            );

            var txTmp = this.clone();

            // SIGHASH_NONE: ignore all outputs? (wildcard payee)
            if ((hashType & 0x1f) === Transaction.SIGHASH_NONE) {
              txTmp.outs = [];

              // ignore sequence numbers (except at inIndex)
              txTmp.ins.forEach(function (input, i) {
                if (i === inIndex) return;

                input.sequence = 0;
              });

              // SIGHASH_SINGLE: ignore all outputs, except at the same index?
            } else if ((hashType & 0x1f) === Transaction.SIGHASH_SINGLE) {
              // https://github.com/bitcoin/bitcoin/blob/master/src/test/sighash_tests.cpp#L60
              if (inIndex >= this.outs.length) return ONE;

              // truncate outputs after
              txTmp.outs.length = inIndex + 1;

              // "blank" outputs before
              for (var i = 0; i < inIndex; i++) {
                txTmp.outs[i] = BLANK_OUTPUT;
              }

              // ignore sequence numbers (except at inIndex)
              txTmp.ins.forEach(function (input, y) {
                if (y === inIndex) return;

                input.sequence = 0;
              });
            }

            // SIGHASH_ANYONECANPAY: ignore inputs entirely?
            if (hashType & Transaction.SIGHASH_ANYONECANPAY) {
              txTmp.ins = [txTmp.ins[inIndex]];
              txTmp.ins[0].script = ourScript;

              // SIGHASH_ALL: only ignore input scripts
            } else {
              // "blank" others input scripts
              txTmp.ins.forEach(function (input) {
                input.script = EMPTY_SCRIPT;
              });
              txTmp.ins[inIndex].script = ourScript;
            }

            // serialize and hash
            var buffer = Buffer.allocUnsafe(txTmp.__byteLength(false) + 4);
            buffer.writeInt32LE(hashType, buffer.length - 4);
            txTmp.__toBuffer(buffer, 0, false);

            return bcrypto.hash256(buffer);
          };

          Transaction.prototype.hashForWitnessV0 = function (
            inIndex,
            prevOutScript,
            value,
            hashType
          ) {
            typeforce(
              types.tuple(
                types.UInt32,
                types.Buffer,
                types.Satoshi,
                types.UInt32
              ),
              arguments
            );

            var tbuffer, toffset;
            function writeSlice(slice) {
              toffset += slice.copy(tbuffer, toffset);
            }
            function writeUInt32(i) {
              toffset = tbuffer.writeUInt32LE(i, toffset);
            }
            function writeUInt64(i) {
              toffset = bufferutils.writeUInt64LE(tbuffer, i, toffset);
            }
            function writeVarInt(i) {
              varuint.encode(i, tbuffer, toffset);
              toffset += varuint.encode.bytes;
            }
            function writeVarSlice(slice) {
              writeVarInt(slice.length);
              writeSlice(slice);
            }

            var hashOutputs = ZERO;
            var hashPrevouts = ZERO;
            var hashSequence = ZERO;

            if (!(hashType & Transaction.SIGHASH_ANYONECANPAY)) {
              tbuffer = Buffer.allocUnsafe(36 * this.ins.length);
              toffset = 0;

              this.ins.forEach(function (txIn) {
                writeSlice(txIn.hash);
                writeUInt32(txIn.index);
              });

              hashPrevouts = bcrypto.hash256(tbuffer);
            }

            if (
              !(hashType & Transaction.SIGHASH_ANYONECANPAY) &&
              (hashType & 0x1f) !== Transaction.SIGHASH_SINGLE &&
              (hashType & 0x1f) !== Transaction.SIGHASH_NONE
            ) {
              tbuffer = Buffer.allocUnsafe(4 * this.ins.length);
              toffset = 0;

              this.ins.forEach(function (txIn) {
                writeUInt32(txIn.sequence);
              });

              hashSequence = bcrypto.hash256(tbuffer);
            }

            if (
              (hashType & 0x1f) !== Transaction.SIGHASH_SINGLE &&
              (hashType & 0x1f) !== Transaction.SIGHASH_NONE
            ) {
              var txOutsSize = this.outs.reduce(function (sum, output) {
                return sum + 8 + varSliceSize(output.script);
              }, 0);

              tbuffer = Buffer.allocUnsafe(txOutsSize);
              toffset = 0;

              this.outs.forEach(function (out) {
                writeUInt64(out.value);
                writeVarSlice(out.script);
              });

              hashOutputs = bcrypto.hash256(tbuffer);
            } else if (
              (hashType & 0x1f) === Transaction.SIGHASH_SINGLE &&
              inIndex < this.outs.length
            ) {
              var output = this.outs[inIndex];

              tbuffer = Buffer.allocUnsafe(8 + varSliceSize(output.script));
              toffset = 0;
              writeUInt64(output.value);
              writeVarSlice(output.script);

              hashOutputs = bcrypto.hash256(tbuffer);
            }

            tbuffer = Buffer.allocUnsafe(156 + varSliceSize(prevOutScript));
            toffset = 0;

            var input = this.ins[inIndex];
            writeUInt32(this.version);
            writeSlice(hashPrevouts);
            writeSlice(hashSequence);
            writeSlice(input.hash);
            writeUInt32(input.index);
            writeVarSlice(prevOutScript);
            writeUInt64(value);
            writeUInt32(input.sequence);
            writeSlice(hashOutputs);
            writeUInt32(this.locktime);
            writeUInt32(hashType);
            return bcrypto.hash256(tbuffer);
          };

          Transaction.prototype.getHash = function () {
            return bcrypto.hash256(
              this.__toBuffer(undefined, undefined, false)
            );
          };

          Transaction.prototype.getId = function () {
            // transaction hash's are displayed in reverse order
            return this.getHash().reverse().toString('hex');
          };

          Transaction.prototype.toBuffer = function (buffer, initialOffset) {
            return this.__toBuffer(buffer, initialOffset, true);
          };

          Transaction.prototype.__toBuffer = function (
            buffer,
            initialOffset,
            __allowWitness
          ) {
            if (!buffer)
              buffer = Buffer.allocUnsafe(this.__byteLength(__allowWitness));

            var offset = initialOffset || 0;
            function writeSlice(slice) {
              offset += slice.copy(buffer, offset);
            }
            function writeUInt8(i) {
              offset = buffer.writeUInt8(i, offset);
            }
            function writeUInt32(i) {
              offset = buffer.writeUInt32LE(i, offset);
            }
            function writeInt32(i) {
              offset = buffer.writeInt32LE(i, offset);
            }
            function writeUInt64(i) {
              offset = bufferutils.writeUInt64LE(buffer, i, offset);
            }
            function writeVarInt(i) {
              varuint.encode(i, buffer, offset);
              offset += varuint.encode.bytes;
            }
            function writeVarSlice(slice) {
              writeVarInt(slice.length);
              writeSlice(slice);
            }
            function writeVector(vector) {
              writeVarInt(vector.length);
              vector.forEach(writeVarSlice);
            }

            writeInt32(this.version);

            var hasWitnesses = __allowWitness && this.hasWitnesses();

            if (hasWitnesses) {
              writeUInt8(Transaction.ADVANCED_TRANSACTION_MARKER);
              writeUInt8(Transaction.ADVANCED_TRANSACTION_FLAG);
            }

            writeVarInt(this.ins.length);

            this.ins.forEach(function (txIn) {
              writeSlice(txIn.hash);
              writeUInt32(txIn.index);
              writeVarSlice(txIn.script);
              writeUInt32(txIn.sequence);
            });

            writeVarInt(this.outs.length);
            this.outs.forEach(function (txOut) {
              if (!txOut.valueBuffer) {
                writeUInt64(txOut.value);
              } else {
                writeSlice(txOut.valueBuffer);
              }

              writeVarSlice(txOut.script);
            });

            if (hasWitnesses) {
              this.ins.forEach(function (input) {
                writeVector(input.witness);
              });
            }

            writeUInt32(this.locktime);

            // avoid slicing unless necessary
            if (initialOffset !== undefined)
              return buffer.slice(initialOffset, offset);
            return buffer;
          };

          Transaction.prototype.toHex = function () {
            return this.toBuffer().toString('hex');
          };

          Transaction.prototype.setInputScript = function (index, scriptSig) {
            typeforce(types.tuple(types.Number, types.Buffer), arguments);

            this.ins[index].script = scriptSig;
          };

          Transaction.prototype.setWitness = function (index, witness) {
            typeforce(types.tuple(types.Number, [types.Buffer]), arguments);

            this.ins[index].witness = witness;
          };

          module.exports = Transaction;
        },
        {
          './bufferutils': 95,
          './crypto': 96,
          './script': 102,
          './types': 128,
          'bitcoin-ops': 39,
          'safe-buffer': 76,
          typeforce: 88,
          'varuint-bitcoin': 91,
        },
      ],
      127: [
        function (require, module, exports) {
          var Buffer = require('safe-buffer').Buffer;
          var baddress = require('./address');
          var bcrypto = require('./crypto');
          var bscript = require('./script');
          var btemplates = require('./templates');
          var networks = require('./networks');
          var ops = require('bitcoin-ops');
          var typeforce = require('typeforce');
          var types = require('./types');
          var scriptTypes = btemplates.types;
          var SIGNABLE = [
            btemplates.types.P2PKH,
            btemplates.types.P2PK,
            btemplates.types.MULTISIG,
          ];
          var P2SH = SIGNABLE.concat([
            btemplates.types.P2WPKH,
            btemplates.types.P2WSH,
          ]);

          var ECPair = require('./ecpair');
          var ECSignature = require('./ecsignature');
          var Transaction = require('./transaction');

          function supportedType(type) {
            return SIGNABLE.indexOf(type) !== -1;
          }

          function supportedP2SHType(type) {
            return P2SH.indexOf(type) !== -1;
          }

          function extractChunks(type, chunks, script) {
            var pubKeys = [];
            var signatures = [];
            switch (type) {
              case scriptTypes.P2PKH:
                // if (redeemScript) throw new Error('Nonstandard... P2SH(P2PKH)')
                pubKeys = chunks.slice(1);
                signatures = chunks.slice(0, 1);
                break;

              case scriptTypes.P2PK:
                pubKeys[0] = script
                  ? btemplates.pubKey.output.decode(script)
                  : undefined;
                signatures = chunks.slice(0, 1);
                break;

              case scriptTypes.MULTISIG:
                if (script) {
                  var multisig = btemplates.multisig.output.decode(script);
                  pubKeys = multisig.pubKeys;
                }

                signatures = chunks.slice(1).map(function (chunk) {
                  return chunk.length === 0 ? undefined : chunk;
                });
                break;
            }

            return {
              pubKeys: pubKeys,
              signatures: signatures,
            };
          }
          function expandInput(scriptSig, witnessStack) {
            if (scriptSig.length === 0 && witnessStack.length === 0) return {};

            var prevOutScript;
            var prevOutType;
            var scriptType;
            var script;
            var redeemScript;
            var witnessScript;
            var witnessScriptType;
            var redeemScriptType;
            var witness = false;
            var p2wsh = false;
            var p2sh = false;
            var witnessProgram;
            var chunks;

            var scriptSigChunks = bscript.decompile(scriptSig);
            var sigType = btemplates.classifyInput(scriptSigChunks, true);
            if (sigType === scriptTypes.P2SH) {
              p2sh = true;
              redeemScript = scriptSigChunks[scriptSigChunks.length - 1];
              redeemScriptType = btemplates.classifyOutput(redeemScript);
              prevOutScript = btemplates.scriptHash.output.encode(
                bcrypto.hash160(redeemScript)
              );
              prevOutType = scriptTypes.P2SH;
              script = redeemScript;
            }

            var classifyWitness = btemplates.classifyWitness(
              witnessStack,
              true
            );
            if (classifyWitness === scriptTypes.P2WSH) {
              witnessScript = witnessStack[witnessStack.length - 1];
              witnessScriptType = btemplates.classifyOutput(witnessScript);
              p2wsh = true;
              witness = true;
              if (scriptSig.length === 0) {
                prevOutScript = btemplates.witnessScriptHash.output.encode(
                  bcrypto.sha256(witnessScript)
                );
                prevOutType = scriptTypes.P2WSH;
                if (redeemScript !== undefined) {
                  throw new Error('Redeem script given when unnecessary');
                }
                // bare witness
              } else {
                if (!redeemScript) {
                  throw new Error(
                    'No redeemScript provided for P2WSH, but scriptSig non-empty'
                  );
                }
                witnessProgram = btemplates.witnessScriptHash.output.encode(
                  bcrypto.sha256(witnessScript)
                );
                if (!redeemScript.equals(witnessProgram)) {
                  throw new Error("Redeem script didn't match witnessScript");
                }
              }

              if (!supportedType(btemplates.classifyOutput(witnessScript))) {
                throw new Error('unsupported witness script');
              }

              script = witnessScript;
              scriptType = witnessScriptType;
              chunks = witnessStack.slice(0, -1);
            } else if (classifyWitness === scriptTypes.P2WPKH) {
              witness = true;
              var key = witnessStack[witnessStack.length - 1];
              var keyHash = bcrypto.hash160(key);
              if (scriptSig.length === 0) {
                prevOutScript =
                  btemplates.witnessPubKeyHash.output.encode(keyHash);
                prevOutType = scriptTypes.P2WPKH;
                if (typeof redeemScript !== 'undefined') {
                  throw new Error('Redeem script given when unnecessary');
                }
              } else {
                if (!redeemScript) {
                  throw new Error(
                    "No redeemScript provided for P2WPKH, but scriptSig wasn't empty"
                  );
                }
                witnessProgram =
                  btemplates.witnessPubKeyHash.output.encode(keyHash);
                if (!redeemScript.equals(witnessProgram)) {
                  throw new Error(
                    'Redeem script did not have the right witness program'
                  );
                }
              }

              scriptType = scriptTypes.P2PKH;
              chunks = witnessStack;
            } else if (redeemScript) {
              if (!supportedP2SHType(redeemScriptType)) {
                throw new Error('Bad redeemscript!');
              }

              script = redeemScript;
              scriptType = redeemScriptType;
              chunks = scriptSigChunks.slice(0, -1);
            } else {
              prevOutType = scriptType = btemplates.classifyInput(scriptSig);
              chunks = scriptSigChunks;
            }

            var expanded = extractChunks(scriptType, chunks, script);

            var result = {
              pubKeys: expanded.pubKeys,
              signatures: expanded.signatures,
              prevOutScript: prevOutScript,
              prevOutType: prevOutType,
              signType: scriptType,
              signScript: script,
              witness: Boolean(witness),
            };

            if (p2sh) {
              result.redeemScript = redeemScript;
              result.redeemScriptType = redeemScriptType;
            }

            if (p2wsh) {
              result.witnessScript = witnessScript;
              result.witnessScriptType = witnessScriptType;
            }

            return result;
          }

          // could be done in expandInput, but requires the original Transaction for hashForSignature
          function fixMultisigOrder(input, transaction, vin) {
            if (
              input.redeemScriptType !== scriptTypes.MULTISIG ||
              !input.redeemScript
            )
              return;
            if (input.pubKeys.length === input.signatures.length) return;

            var unmatched = input.signatures.concat();

            input.signatures = input.pubKeys.map(function (pubKey) {
              var keyPair = ECPair.fromPublicKeyBuffer(pubKey);
              var match;

              // check for a signature
              unmatched.some(function (signature, i) {
                // skip if undefined || OP_0
                if (!signature) return false;

                // TODO: avoid O(n) hashForSignature
                var parsed = ECSignature.parseScriptSignature(signature);
                var hash = transaction.hashForSignature(
                  vin,
                  input.redeemScript,
                  parsed.hashType
                );

                // skip if signature does not match pubKey
                if (!keyPair.verify(hash, parsed.signature)) return false;

                // remove matched signature from unmatched
                unmatched[i] = undefined;
                match = signature;

                return true;
              });

              return match;
            });
          }

          function expandOutput(script, scriptType, ourPubKey) {
            typeforce(types.Buffer, script);

            var scriptChunks = bscript.decompile(script);
            if (!scriptType) {
              scriptType = btemplates.classifyOutput(script);
            }

            var pubKeys = [];

            switch (scriptType) {
              // does our hash160(pubKey) match the output scripts?
              case scriptTypes.P2PKH:
                if (!ourPubKey) break;

                var pkh1 = scriptChunks[2];
                var pkh2 = bcrypto.hash160(ourPubKey);
                if (pkh1.equals(pkh2)) pubKeys = [ourPubKey];
                break;

              // does our hash160(pubKey) match the output scripts?
              case scriptTypes.P2WPKH:
                if (!ourPubKey) break;

                var wpkh1 = scriptChunks[1];
                var wpkh2 = bcrypto.hash160(ourPubKey);
                if (wpkh1.equals(wpkh2)) pubKeys = [ourPubKey];
                break;

              case scriptTypes.P2PK:
                pubKeys = scriptChunks.slice(0, 1);
                break;

              case scriptTypes.MULTISIG:
                pubKeys = scriptChunks.slice(1, -2);
                break;

              default:
                return { scriptType: scriptType };
            }

            return {
              pubKeys: pubKeys,
              scriptType: scriptType,
              signatures: pubKeys.map(function () {
                return undefined;
              }),
            };
          }

          function checkP2SHInput(input, redeemScriptHash) {
            if (input.prevOutType) {
              if (input.prevOutType !== scriptTypes.P2SH)
                throw new Error('PrevOutScript must be P2SH');

              var prevOutScriptScriptHash = bscript.decompile(
                input.prevOutScript
              )[1];
              if (!prevOutScriptScriptHash.equals(redeemScriptHash))
                throw new Error('Inconsistent hash160(RedeemScript)');
            }
          }

          function checkP2WSHInput(input, witnessScriptHash) {
            if (input.prevOutType) {
              if (input.prevOutType !== scriptTypes.P2WSH)
                throw new Error('PrevOutScript must be P2WSH');

              var scriptHash = bscript.decompile(input.prevOutScript)[1];
              if (!scriptHash.equals(witnessScriptHash))
                throw new Error('Inconsistent sha25(WitnessScript)');
            }
          }

          function prepareInput(
            input,
            kpPubKey,
            redeemScript,
            witnessValue,
            witnessScript
          ) {
            var expanded;
            var prevOutType;
            var prevOutScript;

            var p2sh = false;
            var p2shType;
            var redeemScriptHash;

            var witness = false;
            var p2wsh = false;
            var witnessType;
            var witnessScriptHash;

            var signType;
            var signScript;

            if (redeemScript && witnessScript) {
              redeemScriptHash = bcrypto.hash160(redeemScript);
              witnessScriptHash = bcrypto.sha256(witnessScript);
              checkP2SHInput(input, redeemScriptHash);

              if (
                !redeemScript.equals(
                  btemplates.witnessScriptHash.output.encode(witnessScriptHash)
                )
              )
                throw new Error(
                  'Witness script inconsistent with redeem script'
                );

              expanded = expandOutput(witnessScript, undefined, kpPubKey);
              if (!expanded.pubKeys)
                throw new Error(
                  'WitnessScript not supported "' +
                    bscript.toASM(redeemScript) +
                    '"'
                );

              prevOutType = btemplates.types.P2SH;
              prevOutScript =
                btemplates.scriptHash.output.encode(redeemScriptHash);
              p2sh = witness = p2wsh = true;
              p2shType = btemplates.types.P2WSH;
              signType = witnessType = expanded.scriptType;
              signScript = witnessScript;
            } else if (redeemScript) {
              redeemScriptHash = bcrypto.hash160(redeemScript);
              checkP2SHInput(input, redeemScriptHash);

              expanded = expandOutput(redeemScript, undefined, kpPubKey);
              if (!expanded.pubKeys)
                throw new Error(
                  'RedeemScript not supported "' +
                    bscript.toASM(redeemScript) +
                    '"'
                );

              prevOutType = btemplates.types.P2SH;
              prevOutScript =
                btemplates.scriptHash.output.encode(redeemScriptHash);
              p2sh = true;
              signType = p2shType = expanded.scriptType;
              signScript = redeemScript;
              witness = signType === btemplates.types.P2WPKH;
            } else if (witnessScript) {
              witnessScriptHash = bcrypto.sha256(witnessScript);
              checkP2WSHInput(input, witnessScriptHash);

              expanded = expandOutput(witnessScript, undefined, kpPubKey);
              if (!expanded.pubKeys)
                throw new Error(
                  'WitnessScript not supported "' +
                    bscript.toASM(redeemScript) +
                    '"'
                );

              prevOutType = btemplates.types.P2WSH;
              prevOutScript =
                btemplates.witnessScriptHash.output.encode(witnessScriptHash);
              witness = p2wsh = true;
              signType = witnessType = expanded.scriptType;
              signScript = witnessScript;
            } else if (input.prevOutType) {
              // embedded scripts are not possible without a redeemScript
              if (
                input.prevOutType === scriptTypes.P2SH ||
                input.prevOutType === scriptTypes.P2WSH
              ) {
                throw new Error(
                  'PrevOutScript is ' +
                    input.prevOutType +
                    ', requires redeemScript'
                );
              }

              prevOutType = input.prevOutType;
              prevOutScript = input.prevOutScript;
              expanded = expandOutput(
                input.prevOutScript,
                input.prevOutType,
                kpPubKey
              );
              if (!expanded.pubKeys) return;

              witness = input.prevOutType === scriptTypes.P2WPKH;
              signType = prevOutType;
              signScript = prevOutScript;
            } else {
              prevOutScript = btemplates.pubKeyHash.output.encode(
                bcrypto.hash160(kpPubKey)
              );
              expanded = expandOutput(
                prevOutScript,
                scriptTypes.P2PKH,
                kpPubKey
              );

              prevOutType = scriptTypes.P2PKH;
              witness = false;
              signType = prevOutType;
              signScript = prevOutScript;
            }

            if (signType === scriptTypes.P2WPKH) {
              signScript = btemplates.pubKeyHash.output.encode(
                btemplates.witnessPubKeyHash.output.decode(signScript)
              );
            }

            if (p2sh) {
              input.redeemScript = redeemScript;
              input.redeemScriptType = p2shType;
            }

            if (p2wsh) {
              input.witnessScript = witnessScript;
              input.witnessScriptType = witnessType;
            }

            input.pubKeys = expanded.pubKeys;
            input.signatures = expanded.signatures;
            input.signScript = signScript;
            input.signType = signType;
            input.prevOutScript = prevOutScript;
            input.prevOutType = prevOutType;
            input.witness = witness;
          }

          function buildStack(type, signatures, pubKeys, allowIncomplete) {
            if (type === scriptTypes.P2PKH) {
              if (
                signatures.length === 1 &&
                Buffer.isBuffer(signatures[0]) &&
                pubKeys.length === 1
              )
                return btemplates.pubKeyHash.input.encodeStack(
                  signatures[0],
                  pubKeys[0]
                );
            } else if (type === scriptTypes.P2PK) {
              if (signatures.length === 1 && Buffer.isBuffer(signatures[0]))
                return btemplates.pubKey.input.encodeStack(signatures[0]);
            } else if (type === scriptTypes.MULTISIG) {
              if (signatures.length > 0) {
                signatures = signatures.map(function (signature) {
                  return signature || ops.OP_0;
                });
                if (!allowIncomplete) {
                  // remove blank signatures
                  signatures = signatures.filter(function (x) {
                    return x !== ops.OP_0;
                  });
                }

                return btemplates.multisig.input.encodeStack(signatures);
              }
            } else {
              throw new Error('Not yet supported');
            }

            if (!allowIncomplete)
              throw new Error('Not enough signatures provided');
            return [];
          }

          function buildInput(input, allowIncomplete) {
            var scriptType = input.prevOutType;
            var sig = [];
            var witness = [];

            if (supportedType(scriptType)) {
              sig = buildStack(
                scriptType,
                input.signatures,
                input.pubKeys,
                allowIncomplete
              );
            }

            var p2sh = false;
            if (scriptType === btemplates.types.P2SH) {
              // We can remove this error later when we have a guarantee prepareInput
              // rejects unsignable scripts - it MUST be signable at this point.
              if (
                !allowIncomplete &&
                !supportedP2SHType(input.redeemScriptType)
              ) {
                throw new Error('Impossible to sign this type');
              }

              if (supportedType(input.redeemScriptType)) {
                sig = buildStack(
                  input.redeemScriptType,
                  input.signatures,
                  input.pubKeys,
                  allowIncomplete
                );
              }

              // If it wasn't SIGNABLE, it's witness, defer to that
              if (input.redeemScriptType) {
                p2sh = true;
                scriptType = input.redeemScriptType;
              }
            }

            switch (scriptType) {
              // P2WPKH is a special case of P2PKH
              case btemplates.types.P2WPKH:
                witness = buildStack(
                  btemplates.types.P2PKH,
                  input.signatures,
                  input.pubKeys,
                  allowIncomplete
                );
                break;

              case btemplates.types.P2WSH:
                // We can remove this check later
                if (
                  !allowIncomplete &&
                  !supportedType(input.witnessScriptType)
                ) {
                  throw new Error('Impossible to sign this type');
                }

                if (supportedType(input.witnessScriptType)) {
                  witness = buildStack(
                    input.witnessScriptType,
                    input.signatures,
                    input.pubKeys,
                    allowIncomplete
                  );
                  witness.push(input.witnessScript);
                  scriptType = input.witnessScriptType;
                }

                break;
            }

            // append redeemScript if necessary
            if (p2sh) {
              sig.push(input.redeemScript);
            }

            return {
              type: scriptType,
              script: bscript.compile(sig),
              witness: witness,
            };
          }

          function TransactionBuilder(network, maximumFeeRate) {
            this.prevTxMap = {};
            this.network = network || networks.auroracoin;

            // WARNING: This is __NOT__ to be relied on, its just another potential safety mechanism (safety in-depth)
            this.maximumFeeRate = maximumFeeRate || 2500;

            this.inputs = [];
            this.tx = new Transaction();
          }

          TransactionBuilder.prototype.setLockTime = function (locktime) {
            typeforce(types.UInt32, locktime);

            // if any signatures exist, throw
            if (
              this.inputs.some(function (input) {
                if (!input.signatures) return false;

                return input.signatures.some(function (s) {
                  return s;
                });
              })
            ) {
              throw new Error('No, this would invalidate signatures');
            }

            this.tx.locktime = locktime;
          };

          TransactionBuilder.prototype.setVersion = function (version) {
            typeforce(types.UInt32, version);

            // XXX: this might eventually become more complex depending on what the versions represent
            this.tx.version = version;
          };

          TransactionBuilder.fromTransaction = function (transaction, network) {
            var txb = new TransactionBuilder(network);

            // Copy transaction fields
            txb.setVersion(transaction.version);
            txb.setLockTime(transaction.locktime);

            // Copy outputs (done first to avoid signature invalidation)
            transaction.outs.forEach(function (txOut) {
              txb.addOutput(txOut.script, txOut.value);
            });

            // Copy inputs
            transaction.ins.forEach(function (txIn) {
              txb.__addInputUnsafe(txIn.hash, txIn.index, {
                sequence: txIn.sequence,
                script: txIn.script,
                witness: txIn.witness,
              });
            });

            // fix some things not possible through the public API
            txb.inputs.forEach(function (input, i) {
              fixMultisigOrder(input, transaction, i);
            });

            return txb;
          };

          TransactionBuilder.prototype.addInput = function (
            txHash,
            vout,
            sequence,
            prevOutScript
          ) {
            if (!this.__canModifyInputs()) {
              throw new Error('No, this would invalidate signatures');
            }

            var value;

            // is it a hex string?
            if (typeof txHash === 'string') {
              // transaction hashs's are displayed in reverse order, un-reverse it
              txHash = Buffer.from(txHash, 'hex').reverse();

              // is it a Transaction object?
            } else if (txHash instanceof Transaction) {
              var txOut = txHash.outs[vout];
              prevOutScript = txOut.script;
              value = txOut.value;

              txHash = txHash.getHash();
            }

            return this.__addInputUnsafe(txHash, vout, {
              sequence: sequence,
              prevOutScript: prevOutScript,
              value: value,
            });
          };

          TransactionBuilder.prototype.__addInputUnsafe = function (
            txHash,
            vout,
            options
          ) {
            if (Transaction.isCoinbaseHash(txHash)) {
              throw new Error('coinbase inputs not supported');
            }

            var prevTxOut = txHash.toString('hex') + ':' + vout;
            if (this.prevTxMap[prevTxOut] !== undefined)
              throw new Error('Duplicate TxOut: ' + prevTxOut);

            var input = {};

            // derive what we can from the scriptSig
            if (options.script !== undefined) {
              input = expandInput(options.script, options.witness || []);
            }

            // if an input value was given, retain it
            if (options.value !== undefined) {
              input.value = options.value;
            }

            // derive what we can from the previous transactions output script
            if (!input.prevOutScript && options.prevOutScript) {
              var prevOutType;

              if (!input.pubKeys && !input.signatures) {
                var expanded = expandOutput(options.prevOutScript);

                if (expanded.pubKeys) {
                  input.pubKeys = expanded.pubKeys;
                  input.signatures = expanded.signatures;
                }

                prevOutType = expanded.scriptType;
              }

              input.prevOutScript = options.prevOutScript;
              input.prevOutType =
                prevOutType || btemplates.classifyOutput(options.prevOutScript);
            }

            var vin = this.tx.addInput(
              txHash,
              vout,
              options.sequence,
              options.scriptSig
            );
            this.inputs[vin] = input;
            this.prevTxMap[prevTxOut] = vin;
            return vin;
          };

          TransactionBuilder.prototype.addOutput = function (
            scriptPubKey,
            value
          ) {
            if (!this.__canModifyOutputs()) {
              throw new Error('No, this would invalidate signatures');
            }

            // Attempt to get a script if it's a base58 address string
            if (typeof scriptPubKey === 'string') {
              scriptPubKey = baddress.toOutputScript(
                scriptPubKey,
                this.network
              );
            }

            return this.tx.addOutput(scriptPubKey, value);
          };

          TransactionBuilder.prototype.build = function () {
            return this.__build(false);
          };
          TransactionBuilder.prototype.buildIncomplete = function () {
            return this.__build(true);
          };

          TransactionBuilder.prototype.__build = function (allowIncomplete) {
            if (!allowIncomplete) {
              if (!this.tx.ins.length)
                throw new Error('Transaction has no inputs');
              if (!this.tx.outs.length)
                throw new Error('Transaction has no outputs');
            }

            var tx = this.tx.clone();
            // Create script signatures from inputs
            this.inputs.forEach(function (input, i) {
              var scriptType =
                input.witnessScriptType ||
                input.redeemScriptType ||
                input.prevOutType;
              if (!scriptType && !allowIncomplete)
                throw new Error('Transaction is not complete');
              var result = buildInput(input, allowIncomplete);

              // skip if no result
              if (!allowIncomplete) {
                if (
                  !supportedType(result.type) &&
                  result.type !== btemplates.types.P2WPKH
                ) {
                  throw new Error(result.type + ' not supported');
                }
              }

              tx.setInputScript(i, result.script);
              tx.setWitness(i, result.witness);
            });

            if (!allowIncomplete) {
              // do not rely on this, its merely a last resort
              if (this.__overMaximumFees(tx.virtualSize())) {
                throw new Error('Transaction has absurd fees');
              }
            }

            return tx;
          };

          function canSign(input) {
            return (
              input.prevOutScript !== undefined &&
              input.signScript !== undefined &&
              input.pubKeys !== undefined &&
              input.signatures !== undefined &&
              input.signatures.length === input.pubKeys.length &&
              input.pubKeys.length > 0 &&
              (input.witness === false ||
                (input.witness === true && input.value !== undefined))
            );
          }

          TransactionBuilder.prototype.sign = function (
            vin,
            keyPair,
            redeemScript,
            hashType,
            witnessValue,
            witnessScript
          ) {
            // TODO: remove keyPair.network matching in 4.0.0
            if (keyPair.network && keyPair.network !== this.network)
              throw new TypeError('Inconsistent network');
            if (!this.inputs[vin]) throw new Error('No input at index: ' + vin);
            hashType = hashType || Transaction.SIGHASH_ALL;

            var input = this.inputs[vin];

            // if redeemScript was previously provided, enforce consistency
            if (
              input.redeemScript !== undefined &&
              redeemScript &&
              !input.redeemScript.equals(redeemScript)
            ) {
              throw new Error('Inconsistent redeemScript');
            }

            var kpPubKey = keyPair.publicKey || keyPair.getPublicKeyBuffer();
            if (!canSign(input)) {
              if (witnessValue !== undefined) {
                if (input.value !== undefined && input.value !== witnessValue)
                  throw new Error("Input didn't match witnessValue");
                typeforce(types.Satoshi, witnessValue);
                input.value = witnessValue;
              }

              if (!canSign(input))
                prepareInput(
                  input,
                  kpPubKey,
                  redeemScript,
                  witnessValue,
                  witnessScript
                );
              if (!canSign(input))
                throw Error(input.prevOutType + ' not supported');
            }

            // ready to sign
            var signatureHash;
            if (input.witness) {
              signatureHash = this.tx.hashForWitnessV0(
                vin,
                input.signScript,
                input.value,
                hashType
              );
            } else {
              signatureHash = this.tx.hashForSignature(
                vin,
                input.signScript,
                hashType
              );
            }

            // enforce in order signing of public keys
            var signed = input.pubKeys.some(function (pubKey, i) {
              if (!kpPubKey.equals(pubKey)) return false;
              if (input.signatures[i])
                throw new Error('Signature already exists');
              if (
                kpPubKey.length !== 33 &&
                input.signType === scriptTypes.P2WPKH
              )
                throw new Error(
                  'BIP143 rejects uncompressed public keys in P2WPKH or P2WSH'
                );

              var signature = keyPair.sign(signatureHash);
              if (Buffer.isBuffer(signature))
                signature = ECSignature.fromRSBuffer(signature);

              input.signatures[i] = signature.toScriptSignature(hashType);
              return true;
            });

            if (!signed) throw new Error('Key pair cannot sign for this input');
          };

          function signatureHashType(buffer) {
            return buffer.readUInt8(buffer.length - 1);
          }

          TransactionBuilder.prototype.__canModifyInputs = function () {
            return this.inputs.every(function (input) {
              // any signatures?
              if (input.signatures === undefined) return true;

              return input.signatures.every(function (signature) {
                if (!signature) return true;
                var hashType = signatureHashType(signature);

                // if SIGHASH_ANYONECANPAY is set, signatures would not
                // be invalidated by more inputs
                return hashType & Transaction.SIGHASH_ANYONECANPAY;
              });
            });
          };

          TransactionBuilder.prototype.__canModifyOutputs = function () {
            var nInputs = this.tx.ins.length;
            var nOutputs = this.tx.outs.length;

            return this.inputs.every(function (input) {
              if (input.signatures === undefined) return true;

              return input.signatures.every(function (signature) {
                if (!signature) return true;
                var hashType = signatureHashType(signature);

                var hashTypeMod = hashType & 0x1f;
                if (hashTypeMod === Transaction.SIGHASH_NONE) return true;
                if (hashTypeMod === Transaction.SIGHASH_SINGLE) {
                  // if SIGHASH_SINGLE is set, and nInputs > nOutputs
                  // some signatures would be invalidated by the addition
                  // of more outputs
                  return nInputs <= nOutputs;
                }
              });
            });
          };

          TransactionBuilder.prototype.__overMaximumFees = function (bytes) {
            // not all inputs will have .value defined
            var incoming = this.inputs.reduce(function (a, x) {
              return a + (x.value >>> 0);
            }, 0);

            // but all outputs do, and if we have any input value
            // we can immediately determine if the outputs are too small
            var outgoing = this.tx.outs.reduce(function (a, x) {
              return a + x.value;
            }, 0);
            var fee = incoming - outgoing;
            var feeRate = fee / bytes;

            return feeRate > this.maximumFeeRate;
          };

          module.exports = TransactionBuilder;
        },
        {
          './address': 93,
          './crypto': 96,
          './ecpair': 98,
          './ecsignature': 99,
          './networks': 101,
          './script': 102,
          './templates': 104,
          './transaction': 126,
          './types': 128,
          'bitcoin-ops': 39,
          'safe-buffer': 76,
          typeforce: 88,
        },
      ],
      128: [
        function (require, module, exports) {
          var typeforce = require('typeforce');

          var UINT31_MAX = Math.pow(2, 31) - 1;
          function UInt31(value) {
            return typeforce.UInt32(value) && value <= UINT31_MAX;
          }

          function BIP32Path(value) {
            return (
              typeforce.String(value) && value.match(/^(m\/)?(\d+'?\/)*\d+'?$/)
            );
          }
          BIP32Path.toJSON = function () {
            return 'BIP32 derivation path';
          };

          var SATOSHI_MAX = 21 * 1e14;
          function Satoshi(value) {
            return typeforce.UInt53(value) && value <= SATOSHI_MAX;
          }

          // external dependent types
          var BigInt = typeforce.quacksLike('BigInteger');
          var ECPoint = typeforce.quacksLike('Point');

          // exposed, external API
          var ECSignature = typeforce.compile({ r: BigInt, s: BigInt });
          var Network = typeforce.compile({
            messagePrefix: typeforce.oneOf(typeforce.Buffer, typeforce.String),
            bip32: {
              public: typeforce.UInt32,
              private: typeforce.UInt32,
            },
            pubKeyHash: typeforce.UInt8,
            scriptHash: typeforce.UInt8,
            wif: typeforce.UInt8,
          });

          // extend typeforce types with ours
          var types = {
            BigInt: BigInt,
            BIP32Path: BIP32Path,
            Buffer256bit: typeforce.BufferN(32),
            ECPoint: ECPoint,
            ECSignature: ECSignature,
            Hash160bit: typeforce.BufferN(20),
            Hash256bit: typeforce.BufferN(32),
            Network: Network,
            Satoshi: Satoshi,
            UInt31: UInt31,
          };

          for (var typeName in typeforce) {
            types[typeName] = typeforce[typeName];
          }

          module.exports = types;
        },
        { typeforce: 88 },
      ],
    },
    {},
    []
  )('/');
});
