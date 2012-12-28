/**
 * Squirrel
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ./Role.js
 */
elf.define('FS::View::Squirrel', [
    'lang',
    'FS::View::Role'
], function (_, Role) {
    'use strict';
    var Squirrel = Role.extend({
            type: 'Squirrel',
            sprite: function () {

            }
        });

    Squirrel.type = 'Squirrel';

    return Squirrel;
});