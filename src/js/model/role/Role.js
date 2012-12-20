/**
 * Role Base Model
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::Model::Role', [
    'lang',
    'class',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var Role = Class.extend({
        ctor: function () {
            this.mix(eventMixin, elementMixin, stateMixin);
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