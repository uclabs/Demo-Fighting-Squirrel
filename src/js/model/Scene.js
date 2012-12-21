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
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
                this.round = 0;
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            stateHandler: {
                // 准备攻击阶段
                ready: {
                    init: function () {
                        this.round++;
                    },
                    main: function () {
                        var side = this.round % 2,
                            activeGroup = side === 1 ? this.roleGroup1 : this.roleGroup2,
                            idleGroup = side === 1 ? this.roleGroup2 : this.roleGroup1;
                        activeGroup.forEach(function(role) {
                            role.changeState('active');
                        });
                        idleGroup.forEach(function(role) {
                            role.changeState('idle');
                        });
                    },
                    exit: function () {
                        this.roleGroup1.forEach(function(role) {
                            role.changeState('idle');
                        });
                        this.roleGroup2.forEach(function(role) {
                            role.changeState('idle');
                        });
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