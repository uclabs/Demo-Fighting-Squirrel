/**
 * Splash
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::Model::Splash', [
    'lang',
    'class',
    'FS::Util',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, util, eventMixin, elementMixin, stateMixin) {
    'use strict';
    
    var type = 'Splash',
        Splash = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            mix: util.mix,
            // 切换到本场景
            replace: function (transition, time) {
                this.sendView(['replace', transition, time]);
            },
            stateHandler: {
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

    Splash.type = type;

    return Splash;
});