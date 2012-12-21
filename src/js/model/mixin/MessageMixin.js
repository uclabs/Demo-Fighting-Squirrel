/**
 * MessageMixin
 *
 * @import ../../Dispatcher.js
 */
elf.define('FS::Model::MessageMixin', ['FS::Controller::Messager'], function (messager) {
    'use strict';
    var mixin = {
            // 监听消息
            listenMessage: function (event, handler) {
                return messager.bind(event, handler);
            },
            // 派发消息
            postMessage: function (event, args) {
                return messager.fire(event, args);
            }
        };

    return mixin;
});