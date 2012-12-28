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
                this.listenController(opts.uuid, this.invoke.bind(this));
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            idle: function() {
                log('view:' + this.type + ':' + this.uuid, 'idle');
            },
            active: function() {
                log('view:' + this.type + ':' + this.uuid, 'active');
                // 模拟玩家进行攻击
                // TODO-delete 完成后移除
                var that = this,
                    weapon = this.weapon;
                setTimeout(function() {
                    var sendController = Math.random() < 0.95;
                    if (sendController) {
                        that.attack({x: weapon.x + 50, y: weapon.y - 520});
                    }
                }, Math.random() * 7000);
            },
            attack: function(vector) {
                log('view:' + this.type + ':' + this.uuid, 'attack', vector);
                this.sendController(['attack', vector]);
            }
        });

    Role.type = 'Role';

    return Role;
});