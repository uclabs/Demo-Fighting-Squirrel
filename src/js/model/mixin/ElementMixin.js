/**
 * ElementMixin
 */
elf.define('FS::Model::ElementMixin', [], function () {
    'use strict';
    var mixin = {
            id: null,
            x: null,
            y: null,
            move: function (x, y) {                
                this.fire(['move', x, y]);
                state.main.apply(this, args);
            }
        };

    return mixin;
});