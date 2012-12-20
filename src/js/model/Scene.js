/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import mixin/EventMixin.js
 * @import mixin/ElementMixin.js
 * @import mixin/StateMixin.js
 */
elf.define('FS::Model::Scene', [
    'lang',
    'class',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        Scene = Class.extend({
        ctor: function (opts) {
            this.mix(eventMixin, elementMixin, stateMixin);
            this.config(opts);
        },
        mix: function () {
            _.extend.apply(_, concat.apply([this], arguments));
        },
        stateHandler: {
            // 准备攻击阶段
            ready: {
                init: function () {},
                main: function () {},
                exit: function () {}
            },
            // 攻击进行中
            attack: {
                init: function () {},
                main: function () {},
                exit: function () {}
            }
        }
    });

    return Scene;
});