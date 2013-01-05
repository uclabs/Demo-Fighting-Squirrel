/**
 * Remote
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../common/Config.js
 * @import ../../common/Util.js
 * @import ../../common/model/mixin/MessageMixin.js
 */
elf.define('FS::Controller::Remote', [
    'lang',
    'FS::Config',
    'FS::Util',
    'FS::Model::MessageMixin'
], function (_, config, util, messageMixin) {
    'use strict';

    var remote = {
            mix: util.mix,
            enabled: false
        };

    remote.mix(messageMixin);

    remote.init = function() {
        this.listenMessage('mode', this.onModeChange.bind(this));
        this.listenMessage('player', this.onPlayerChange.bind(this));
        this.listenMessage('game', this.onGameChange.bind(this));
    };

    remote.onModeChange = function(mode) {
        log('remote', 'mode', mode);
        this.enabled = mode === 'online';
        log('remote', 'enabled', this.enabled);
    };

    remote.onPlayerChange = function(player) {
        if (this.enabled) {
            log('remote', 'player', player);
        }
    };

    remote.onGameChange = function(action) {
        if (action === 'start') {
            log('remote', 'working', this.enabled);
        }
    };

    return remote;
});