/**
 * Stone
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ./Weapon.js
 */
elf.define('FS::View::Stone', [
    'lang',
    'FS::View::Weapon'
], function (_, Weapon) {
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