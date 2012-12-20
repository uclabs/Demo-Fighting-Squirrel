/**
 * Weapon Base Model
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::Model::Weapon', ['lang', 'class', 'FS::Model::StateMixin'], function (_, Class, stateMixin) {
    'use strict';
    var Weapon = Class.extend({
        ctor: function () {
            this.mix(stateMixin);
        },
        mix: function () {
            _.extend.apply(_, [this].concat(arguments));
        },
        stateHandler: {
            idle: {
                init: function () {},
                main: function () {},
                exit: function () {}
            },
            active: {
                init: function () {},
                main: function () {},
                exit: function () {}
            }
        }
    });

    return Weapon;
});