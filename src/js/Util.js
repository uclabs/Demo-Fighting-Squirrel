/**
 * Util
 *
 * @import ../lib/elf/core/lang.js
 */
elf.define('FS::Util', ['lang'], function (_) {
    'use strict';
    var concat = Array.prototype.concat,
        slice = Array.prototype.slice,
        exports = {};

    exports.isRole = function(obj) {
        var types = ['Role', 'Squirrel'],
            type = _.type(obj) === 'object' ? obj.type : obj;
        for (var i = 0, len = types.length; i < len; i++) {
            if (types[i] === type) {
                return true;
            }
        }
        return false;
    };

    exports.isWeapon = function(obj) {
        var types = ['Weapon', 'Stone'],
            type = _.type(obj) === 'object' ? obj.type : obj;
        for (var i = 0, len = types.length; i < len; i++) {
            if (types[i] === type) {
                return true;
            }
        }
        return false;
    };

    exports.comparePosition = function(v1, v2) {
        if (!v1 || !v2) {
            return false;
        }
        return (v1.x === v2.x) && (v1.y === v2.y);
    };

    exports.mix = function () {
        return function() {
            var override = arguments[0] === true;
            if (override) {
                _.extend.apply(_, concat.apply([true, this], arguments));
            } else {
                var startIndex = _.type(arguments[0]) === 'boolean' ? 1 : 0,
                    args = slice.call(arguments, startIndex);
                for (var i = 0, len = args.length; i < len; i++) {
                    var arg = args[i];
                    for (var name in arg) {
                        if (this[name]) {
                            delete arg[name];
                        }
                    }
                }
                _.extend.apply(_, concat.apply([true, this], args));
            }
        }
    };

    return exports;
});