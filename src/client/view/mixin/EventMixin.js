/**
 * EventMixin
 *
 * @import ../../../common/Dispatcher.js
 */
elf.define('FS::View::EventMixin', ['FS::Dispatcher'], function (dispatcher) {
    'use strict';

    var uplink = dispatcher.uplink,
        downlink = dispatcher.downlink,
        mixin = {
            listenController: function (event, handler) {
                if (typeof event === 'function') {
                    handler = event;
                    event = this.uuid;
                }
                if (typeof event === 'string' && typeof handler === 'function') {
                    return downlink.bind(event, handler);
                }
            },
            unlistenController: function (event, handler) {
                if (typeof event === 'function') {
                    handler = event;
                    event = this.uuid;
                }
                if (typeof event === 'string') {
                    return downlink.unbind(event, handler);
                }
            },
            sendController: function (event, args) {
                if (Array.isArray(event)) {
                    args = event;
                    event = this.uuid;
                }
                if (typeof event === 'string') {
                    return uplink.fire(event, args);
                }
            }
        };

    return mixin;
});