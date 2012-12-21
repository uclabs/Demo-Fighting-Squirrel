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
            config: function(opts) {
                _.extend(true, this, opts);
            },
            // 物体移动
            move: function (x, y) {                
                this.fire(['move', x, y]);
                state.main.apply(this, args);
            }
        };

    return mixin;
});