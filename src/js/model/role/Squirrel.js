/**
 * Squirrel
 *
 * @import ../../../lib/elf/core/lang.js
 * @import Role.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::Model::Squirrel', [
    'lang',
    'FS::Model::Role',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Role, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var Squirrel = Role.extend({
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

    Squirrel.type = 'Squirrel';

    return Squirrel;
});