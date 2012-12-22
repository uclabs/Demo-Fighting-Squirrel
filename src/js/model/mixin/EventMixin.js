/**
 * EventMixin
 *
 * @import ../../Dispatcher.js
 */
elf.define('FS::Model::EventMixin', ['FS::Dispatcher'], function (dispatcher) {
    'use strict';
    var uplink = dispatcher.uplink,
        downlink = dispatcher.downlink,
        mixin = {
            // 绑定消息处理
            bind: function (event, handler) {
                if (typeof event === 'function') {
                    handler = event;
                    event = this.uuid;
                }
                if (typeof event === 'string' && typeof handler === 'function') {
                    return uplink.bind(event, handler);
                }
            },
            // 解绑消息处理
            unbind: function (event, handler) {
                if (typeof event === 'function') {
                    handler = event;
                    event = this.uuid;
                }
                if (typeof event === 'string') {
                    return uplink.unbind(event, handler);
                }
            },
            // 派发消息
            fire: function (event, args) {
                if (Array.isArray(event)) {
                    args = event;
                    event = this.uuid;
                }
                if (typeof event === 'string') {
                    return downlink.fire(event, args);
                }
            }
        };

    return mixin;
});