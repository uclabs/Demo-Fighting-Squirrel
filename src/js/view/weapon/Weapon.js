/**
 * Base Model for Weapon
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::View::Weapon', [
    'lang',
    'class',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        Weapon = Class.extend({
            type: 'Weapon',
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
                this.bind(opts.uuid, this.invoke.bind(this));
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
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

    Weapon.type = 'Weapon';

    return Weapon;
});