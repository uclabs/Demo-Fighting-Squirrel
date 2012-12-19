/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import StateMixin.js
 */
elf.define('FS::Model::Scene', ['lang', 'class', 'FS::Model::StateMixin'], function (_, Class, stateMixin) {
    var Scene = Class.extend({
        ctor: function () {
            this.mix(stateMixin);
        },
        mix: function () {
            _.extend.apply(_, [this].concat(arguments));
        },
        stateHandler: {
            // 准备攻击阶段
            ready: {
                init: function () {},
                main: function () {},
                exit: function () {}
            },
            // 攻击进行中
            attacking: {
                init: function () {},
                main: function () {},
                exit: function () {}
            },
            // 命中
            hit: {
                init: function () {},
                main: function () {},
                exit: function () {}
            }
        }
    });

    return Scene;
});