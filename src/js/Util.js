/**
 * Util
 *
 * @import ../lib/elf/core/lang.js
 */
elf.define('FS::Util', ['lang'], function (_) {
    'use strict';
    var exports = {};

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

    return exports;
});