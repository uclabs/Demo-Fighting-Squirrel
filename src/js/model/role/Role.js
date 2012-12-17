/**
 * Role Base Model
 *
 * @import ../../../../lib/elf/core/lang.js
 * @import ../../../../lib/elf/mod/class.js
 * @import ../StateMixin.js
 */
elf.define('FS::Model::Role', ['lang', 'class', 'FS::Model::StateMixin'], function (_, Class, stateMixin) {
    var Role = Class.extend({
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

    return Role;
});