/**
 * ElementMixin
 *
 * @import ../../../lib/elf/core/lang.js
 */
elf.define('FS::Model::ElementMixin', ['lang'], function (_) {
    'use strict';
    var mixin = {
            // 属性配置
            config: function (opts) {
                var isConfig = function(value) {
                    var type = _.type(value);
                    return type === 'string' || type === 'number' || type === 'boolean';
                }
                if (opts) {
                    var filtedOpts = {};
                    _.each(opts, function(value, key) {
                        if (isConfig(value)) {
                            filtedOpts[key] = value;
                        }
                    });
                    _.extend(true, this, opts);
                } else {
                    opts = {};
                    for (var key in this) {
                        var value = this[key];
                        if (isConfig(value)) {
                            opts[key] = value;
                        }
                    }
                    return opts;
                }
            },
            // 插入元素
            addChild: function (child, index) {
                var uuid = _.type(child) === 'object' ? child.uuid : child;
                this.sendView(['addChild', uuid, index]);
            },
            // 移动
            move: function (x, y) {
                if (_.type(x) === 'object') {
                    y = x.y;
                    x = x.x;
                }
                if (_.type(x) === 'number' && _.type(y) === 'number') {
                    log('controller:' + this.type + ':' + this.uuid, 'move', x, y);
                    this.sendView(['move', x, y]);
                }
            },
            // 销毁
            destroy: function() {
                log('controller:' + this.type + ':' + this.uuid, 'destroy');
            },
            // 碰撞
            collision: function(arg) {
                // 广播物体被碰撞
                this.sendMessage('Element', [this.uuid, 'collision', arg]);
            }
        };

    return mixin;
});