/**
 * Squirrel
 *
 * @import ../../../lib/elf/core/lang.js
 * @import Role.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::View::Squirrel', [
    'lang',
    'FS::View::Role',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Role, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var Squirrel = Role.extend({
            type: 'Squirrel'
        });

    Squirrel.type = 'Squirrel';

    return Squirrel;
});