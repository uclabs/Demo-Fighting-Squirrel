/**
 * Base Model for Roles
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::View::Role', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, util, eventMixin, elementMixin, stateMixin) {
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
            mix: util.mix,
            idle: function () {
                log('view:' + this.type + ':' + this.uuid, 'idle');
                // 模拟玩家违规攻击，以便检测攻击合法性判断是否正确
                // TODO-delete 完成后移除
                var that = this,
                    weapon = this.weapon,
                    vector = {x: -1500 + Math.random() * -800, y: -200 + Math.random() * -300};
                if (this.x > 600) {
                    vector.x = -vector.x;
                }
                setTimeout(function () {
                    var sendController = Math.random() < 0.95;
                    if (sendController) {
                        that.attack(vector);
                    }
                }, Math.random() * 6000 + 1500);
            },
            active: function () {
                log('view:' + this.type + ':' + this.uuid, 'active');
                // 模拟玩家进行攻击
                // TODO-delete 完成后移除
                var that = this,
                    weapon = this.weapon,
                    vector = {x: 1500 + Math.random() * 800, y: -200 + Math.random() * -300};
                if (this.x > 600) {
                    vector.x = -vector.x;
                }
                setTimeout(function () {
                    var sendController = Math.random() < 0.95;
                    if (sendController) {
                        that.attack(vector);
                    }
                }, Math.random() * 6000 + 1500);
            },
            attack: function (vector) {
                log('view:' + this.type + ':' + this.uuid, 'attack', vector);
                this.sendController(['attack', vector]);
            }
        });

    Role.type = 'Role';

    return Role;
});