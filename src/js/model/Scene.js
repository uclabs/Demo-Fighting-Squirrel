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
        Scene = Class.extend({
            type: 'Scene',
            ctor: function (opts) {
                this.mix(eventMixin, stateMixin);
                this.config = _.extend({
                    round: 0
                }, opts);
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            stateHandler: {
                // 准备攻击阶段
                ready: {
                    init: function () {
                        var roleGroup = this.roleGroup;
                        // TODO: 摆放各元素

                        this.round += 1;
                        this.currentRole = roleGroup[this.round % roleGroup.length - 1];
                    },
                    main: function () {
                        this.currentRole.changeState('active');
                    },
                    exit: function () {
                        this.currentRole.changeState('idle');
                        this.currentRole = null;
                    }
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