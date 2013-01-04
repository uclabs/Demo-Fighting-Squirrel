/**
 * MessageMixin
 *
 * @import ../../controller/Messager.js
 */
elf.define('FS::Model::MessageMixin', [
    'FS::Controller::Messager'
], function (messager) {
    'use strict';
    
    var mixin = {
            // 监听消息
            listenMessage: function (event, handler) {
                return messager.bind(event, handler);
            },
            // 取消监听消息
            unlistenMessage: function (event, handler) {
                return messager.unbind(event, handler);
            },
            // 派发消息
            sendMessage: function (event, args) {
                return messager.fire(event, args);
            }
        };

    return mixin;
});