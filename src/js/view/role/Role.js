/**
 * Base Model for Roles
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::View::Role', [
    'lang',
    'class',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        Role = Class.extend({
            type: 'Role',
            weapon: null,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
                this.bind(opts.uuid, this.invoke.bind(this));
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            idle: function() {
                log(this.type + ':' + this.uuid, 'idle');
            },
            active: function() {
                log(this.type + ':' + this.uuid, 'active');
            }
        });

    Role.type = 'Role';

    return Role;
});