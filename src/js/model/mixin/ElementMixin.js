/**
 * ElementMixin
 *
 * @import ../../../lib/elf/core/lang.js
 */
elf.define('FS::Model::ElementMixin', ['lang'], function (_) {
    'use strict';
    var mixin = {
            id: null,
            x: null,
            y: null,
            config: function(opts) {
                _.extend(true, this, opts);
            },
            move: function (x, y) {                
                this.fire(['move', x, y]);
                state.main.apply(this, args);
            }
        };

    return mixin;
});