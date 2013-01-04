/**
 * Scene
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../../common/Util.js
 * @import ../../../common/model/mixin/EventMixin.js
 * @import ../../../common/model/mixin/ElementMixin.js
 * @import ../../../common/model/mixin/StateMixin.js
 */
elf.define('FS::Model::Scene', [
    'lang',
    'class',
    'FS::Util',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, util, eventMixin, elementMixin, stateMixin) {
    'use strict';
    
    var concat = Array.prototype.concat,
        type = 'Scene',
        Scene = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            mix: util.mix,
            // 冻结场景
            freeze: function () {
            },
            // 改变回合方
            changeSide: function (side) {
                this.sendView(['changeSide', side]);
            },
            // 
            replace: function (transition, time) {
                this.sendView(['replace', transition, time]);
            },
            stateHandler: {
                // 冻结
                freeze: function () {
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