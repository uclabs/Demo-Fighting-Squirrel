/**
 * Stone
 *
 * @import ../../../lib/elf/core/lang.js
 * @import Weapon.js
 */
elf.define('FS::Model::Stone', [
    'lang',
    'FS::Model::Weapon',
], function (_, Weapon) {
    'use strict';
    var type = 'Stone',
        Stone = Weapon.extend({
            type: type,
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

    Stone.type = type;

    return Stone;
});