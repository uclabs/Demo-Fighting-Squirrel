/**
 * ElementMixin
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../Config.js
 * @import ../../Util.js
 */
elf.define('FS::Model::ElementMixin', ['lang', 'FS::Config', 'FS::Util'], function (_, config, util) {
    'use strict';
    var comparePosition = util.comparePosition,
        mixin = {
            // 属性配置
            config: function (opts) {
                var isConfig = function (value) {
                    var type = _.type(value);
                    return type === 'string' || type === 'number' || type === 'boolean';
                }
                if (opts) {
                    var filtedOpts = {};
                    _.each(opts, function (value, key) {
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
                    // log('controller:' + this.type + ':' + this.uuid, 'move', x, y);
                    this.lastPosition = {x: x, y: y};
                    this.sendView(['move', x, y]);
                }
            },
            // 获取当前位置
            position: function () {
                if (!this.body) {
                    return {x: 0, y: 0};
                }
                var position = this.body.GetPosition(),
                    x = this.zoomOut(position.x),
                    y = this.zoomOut(position.y);
                return {x: x, y: y};
            },
            updatePosition: function () {
                var position = this.position();

                // 只有位置改变，才需要更新
                if (!comparePosition(position, this.lastPosition)) {
                    this.move(position);
                }
            },
            // 撞击
            impact: function (force) {
                force = this.zoomOut(force);
                this.sendView(['impact', force]);
            },
            // 销毁
            destroy: function () {
                log('controller:' + this.type + ':' + this.uuid, 'destroy');
            },
            // 碰撞
            collision: function (arg) {
                // 广播物体被碰撞
                this.sendMessage('Element', [this.uuid, 'collision', arg]);
            },
            // 把外界数值转化为小世界的数值
            zoomIn: function (value) {
                return value / config.world.scale;
            },
            // 吧小世界的数值转化为大世界的数值
            zoomOut: function (value) {
                return value * config.world.scale;
            }
        };

    return mixin;
});