/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
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
        type = 'Scene',
        Scene = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            // 冻结场景
            freeze: function() {
            },
            stateHandler: {
                // 冻结
                freeze: function() {
                    this.freeze();
                },
                // 攻击预备阶段
                ready: {
                    init: function () {
                        this.freeze();
                    },
                    main: function () {
                    },
                    exit: function () {
                        this.freeze();
                    }
                },
                // 攻击进行中
                attack: {
                    init: function () {
                        this.freeze();
                    },
                    main: function () {

                    },
                    exit: function () {
                        this.freeze();
                    }
                }
            }
        });

    Scene.type = type;

    return Scene;
});