/**
 * Base Model for Roles
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::Model::Role', [
    'lang',
    'class',
    'FS::Model::EventMixin',
    'FS::Model::MessageMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        slice = Array.prototype.slice,
        type = 'Role',
        Role = Class.extend({
            type: type,
            weapon: null,
            player: null, // 所属的玩家
            ctor: function (opts) {
                var that = this;
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenView(this.uuid, function() {
                    var args = slice.apply(arguments);
                    args.unshift(that.uuid);
                    that.sendMessage(type, args);
                });
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            active: function() {
                this.sendView(['active']);
            },
            idle: function() {
                this.sendView(['idle']);
            },
            stateHandler: {
                idle: {
                    init: function () {},
                    main: function () {
                        this.idle();
                    },
                    exit: function () {}
                },
                active: {
                    init: function () {},
                    main: function () {
                        this.active();
                    },
                    exit: function () {}
                }
            }
        });

    Role.type = type;

    return Role;
});