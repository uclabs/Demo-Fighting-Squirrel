/**
 * EventMixin
 *
 * ../Dispatcher.js
 */
elf.define('FS::View::EventMixin', ['FS::Dispatcher'], function (dispatcher) {
    var uplink = dispatcher.uplink,
        downlink = dispatcher.downlink,
        eventMixin = {
            bind: function (event, handler) {
                if (typeof event === 'function') {
                    handler = event;
                    event = this.id;
                }
                if (typeof event === 'string' && typeof handler === 'function') {
                    return downlink.bind(event, handler);
                }
            },
            unbind: function (event, handler) {
                if (typeof event === 'function') {
                    handler = event;
                    event = this.id;
                }
                if (typeof event === 'string') {
                    return downlink.unbind(event, handler);
                }
            },
            fire: function (event, args) {
                if (Array.isArray(event)) {
                    args = event;
                    event = this.id;
                }
                if (typeof event === 'string') {
                    return uplink.fire(event, args);
                }
            }
        };

    return eventMixin;
});