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
                log('controller:Player:' + this.uuid, 'create', opts);
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
            },
            gameReady: function() {
                log('controller:Player:' + this.uuid, 'game', 'ready');
                this.sendView(['game', 'ready']);
            },
            roundInit: function () {
                log('controller:Player:' + this.uuid, 'round', 'init');
                this.sendView(['round', 'init']);
            }
        });

    Player.type = type;

    return Player;
});