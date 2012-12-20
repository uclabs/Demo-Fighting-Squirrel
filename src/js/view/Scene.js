/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 */
elf.define('FS::View::Scene', ['lang', 'class'], function (_, Class) {
    'use strict';

    var Scene = Class.extend({
        ctor: function () {

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
            attack: {
                init: function () {},
                main: function () {},
                exit: function () {}
            }
        }
    });

    return Scene;
});