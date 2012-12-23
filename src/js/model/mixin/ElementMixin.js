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
            // 属性配置
            config: function (opts) {
                _.extend(true, this, opts);
            },
            // 插入元素
            append: function () {
                var arr = ['append'],
                    push = function(child) {
                        var uuid = _.type(child) === 'object' ? child.uuid : child;
                        arr.push(uuid);
                    };
                for (var i = 0, len = arguments.length; i < len; i++) {
                    if (Array.isArray(arguments[i])) {
                        var children = arguments[i];
                        for (var j = 0, count = children.length; j < count; j++) {
                            push(children[j]);
                        }
                    } else {
                        push(arguments[i]);
                    }
                }
                this.fire(arr);
            },
            // 插入到某元素
            appendTo: function(parent) {
                var pid = _.type(parent) === 'object' ? parent.id : parent;
                this.fire(['appendTo', pid]);
            },
            // 移动
            move: function (x, y) {
                if (_.type(x) === 'object') {
                    y = x.y;
                    x = x.x;
                }
                if (_.type(x) === 'number' && _.type(y) === 'number') {
                    this.fire(['move', x, y]);
                }
            },
            // 碰撞
            collision: function(arg) {
                // 广播物体被碰撞
                this.postMessage('Element', [this.uuid, 'collision', arg]);
            }
        };

    return mixin;
});