/**
 * Role
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::View::Role', ['lang', 'class', 'FS::View::EventMixin', 'FS::View::StateMixin'], function (_, Class, eventMixin, stateMixin) {
    'use strict';

    var Role = Class.extend({
        ctor: function () {
            this.mix(eventMixin, stateMixin);
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

    return Role;
});