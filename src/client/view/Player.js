/**
 * Player
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../../common/Util.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/MessageMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::View::Player', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, util, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';
    
    var type = 'Player',
        Player = Class.extend({
            type: type,
            side: 0,
            race: '',
            mix: util.mix,
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));

                this.listenMessage('game', this.game.bind(this));
                this.listenMessage('round', this.round.bind(this));
            },
            game: function(action) {
                if (action === 'ready') {
                    this.gameReady();
                } else if (action === 'start') {
                    this.gameStart();
                }
            },
            round: function(action) {
                if (action === 'ready') {
                    this.roundReady();
                }
            },
            gameStart: function() {
                log('view:Player:' + this.uuid, 'game', 'start');
                this.sendController('game', ['start', this.uuid]);
            },
            gameReady: function() {
                log('view:Player:' + this.uuid, 'game', 'ready');
                this.sendController('game', ['ready', this.uuid]);
            },
            roundReady: function() {
                log('view:Player:' + this.uuid, 'round', 'ready');
                this.sendController('round', ['ready', this.uuid]);
            }
        });

    Player.type = type;

    return Player;
});