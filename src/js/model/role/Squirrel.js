/**
 * Squirrel
 *
 * @import ../../../lib/elf/core/lang.js
 * @import Role.js
 */
elf.define('FS::Model::Squirrel', [
    'lang',
    'FS::Model::Role'
], function (_, Role) {
    'use strict';
    var type = 'Squirrel',
        Squirrel = Role.extend({
            type: type
        });

    Squirrel.type = type;

    return Squirrel;
});