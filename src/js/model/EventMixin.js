/**
 * EventMixin
 *
 * @import ../Dispatcher.js
 */
elf.define('FS::Model::EventMixin', ['FS::Dispatcher'], function (dispatcher) {
    var uplink = dispatcher.uplink,
        downlink = dispatcher.downlink,
        mixin = {
            bind: function (event, handler) {
                if (typeof event === 'function') {
                    handler = event;
                    event = this.id;
                }
                if (typeof event === 'string' && typeof handler === 'function') {
                    return uplink.bind(event, handler);
                }
            },
            unbind: function (event, handler) {
                if (typeof event === 'function') {
                    handler = event;
                    event = this.id;
                }
                if (typeof event === 'string') {
                    return uplink.unbind(event, handler);
                }
            },
            fire: function (event, args) {
                if (Array.isArray(event)) {
                    args = event;
                    event = this.id;
                }
                if (typeof event === 'string') {
                    return downlink.fire(event, args);
                }
            }
        };

    return mixin;
});