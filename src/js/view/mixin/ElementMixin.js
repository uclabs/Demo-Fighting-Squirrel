/**
 * ElementMixin
 *
 * @import ../../../lib/elf/core/lang.js
 */
elf.define('FS::View::ElementMixin', ['lang'], function (_) {
    'use strict';
    var mixin = {
            config: function(opts) {
                _.extend(true, this, opts);
            },
            move: function (x, y) {
                // move
            }
        };

    return mixin;
});