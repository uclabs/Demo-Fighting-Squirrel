/**
 * Stone
 *
 * @import ../../../lib/elf/core/lang.js
 * @import Weapon.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::View::Stone', [
    'lang',
    'FS::View::Weapon',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Weapon, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var Stone = Weapon.extend({
            type: 'Stone',
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

    Stone.type = 'Stone';

    return Stone;
});