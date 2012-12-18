/**
 * ElementMixin
 *
 * @import ../Dispatcher.js
 */
elf.define('FS::Model::ElementMixin', ['FS::Dispatcher'], function (dispatcher) {
    var downlink = dispatcher.downlink;
        mixin = {
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