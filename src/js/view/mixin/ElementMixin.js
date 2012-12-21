/**
 * ElementMixin
 *
 * @import ../../../lib/elf/core/lang.js
 */
elf.define('FS::View::ElementMixin', ['lang'], function (_) {
    'use strict';
    var mixin = {
            // 配置属性
            config: function(opts) {
                _.extend(true, this, opts);
            },
            action: function() {
                return function() {console.log('!!action');
                    var action = arguments[0],
                        fn = this[action],
                        args = Array.prototype.slice.call(arguments, 1);console.log(action, fn, args);
                    fn.apply(this, args);
                };
            },
            // 插入元素
            append: function () {
                log(this.id, 'append', arguments);
            },
            // 插入到某元素
            appendTo: function(parent) {
                log(this.id, 'appendTo', parent);
            },
            // 移动元素
            move: function (x, y) {
                // move
                log(this.id, 'move', x, y);
            }
        };

    return mixin;
});