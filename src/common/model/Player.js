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
elf.define('FS::Model::Player', [
    'lang',
    'class',
    'FS::Util',
    'FS::Model::EventMixin',
    'FS::Model::ElementMixin',
    'FS::Model::StateMixin'
], function (_, Class, util, eventMixin, elementMixin, stateMixin) {
    'use strict';
    
    var type = 'Player',
        Player = Class.extend({
            type: type,
            side: 0,
            race: '',
            mix: util.mix,
            ctor: function (opts) {
                this.roles = [];
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            gameReady: function() {
                this.sendView(['gameReady']);
            },
            roundInit: function () {
                this.sendView(['roundInit']);
            }
        });

    Player.type = type;

    return Player;
});