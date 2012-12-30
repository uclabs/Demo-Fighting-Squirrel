/**
 * Player
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../Util.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::View::Player', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, Box2D, util, eventMixin, elementMixin, stateMixin) {
    'use strict';
    
    var type = 'Player',
        Player = Class.extend({
            type: type,
            side: 0,
            race: '',
            ctor: function (opts) {
                this.roles = [];
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            mix: util.mix
        });

    Player.type = type;

    return Player;
});