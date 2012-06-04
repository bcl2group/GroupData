/****************************************************************************
 **
 ** This file is part of yFiles for HTML 1.0-EAP1.
 ** 
 ** yWorks proprietary/confidential. Use is subject to license terms.
 **
 ** Redistribution of this file or of an unauthorized byte-code version
 ** of this file is strictly forbidden.
 **
 ** Copyright (c) 2012 by yWorks GmbH, Vor dem Kreuzberg 28, 
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ***************************************************************************/
/*
Provides support for standard ecmaScript features not present in the browser.
The goal is to support at least:
- IE9
- Firefox 8
- Chrome 13
- Safari 5.1
- WebKit
- Opera 12

as defined by http://kangax.github.com/es5-compat-table/
 */

if(!Function.prototype.bind) {
    Object.defineProperty(Function.prototype, 'bind', {
        value: function(that) {
            // implemented according to Mozilla Developer Network
            if(typeof this !== 'function') {
                throw new TypeError('Function.prototype.bind was not called on a function but: '+(typeof this));
            }

            var slice = Array.prototype.slice;
            var args = slice.call(arguments, 1);
            var noOperation = function() {};
            var fn = this;
            var bound = function() {
                return fn.apply(this instanceof noOperation ? this : that || window,
                    args.concat(slice.call(arguments)));
            };
            noOperation.prototype = this.prototype;
            bound.prototype = new noOperation();

            return bound;
        },
        writable: true, enumerable: false, configurable: true
    });
}

if(!Object.freeze) {
    Object.defineProperty(Object, 'freeze', {
        value: function(obj) {
            return obj; // fake, can't be implemented
        }
    });
}

if(!Object.seal) {
    Object.defineProperty(Object, 'seal', {
        value: function(obj) {
            // do nothing
        }
    });
}

if(!Object.preventExtensions) {
    Object.defineProperty(Object, 'preventExtensions', {
        value: function(obj) {
        }
    });
}

if(!Object.isSealed) {
    Object.defineProperty(Object, 'isSealed', {
        value: function(obj) {
            return false;
        }
    });
}

if(!Object.isFrozen) {
    Object.defineProperty(Object, 'isFrozen', {
        value: function(obj) {
            return false;
        }
    });
}

if(!Object.isExtensible) {
    Object.defineProperty(Object, 'isExtensible', {
        value: function(obj) {
            return true;
        }
    });
}

// Define console.log() if it is not defined.
// Otherwise, console.log blows up IE unless the developer tools are shown.
if(!window.console) { window.console = {}; }
if(!window.console.log) { window.console.log = function(s) {}; }