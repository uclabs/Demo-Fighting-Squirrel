/**
 * Splash
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 */
elf.define('FS::View::Splash', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin'
], function (_, Class, util, eventMixin, messageMixin, elementMixin) {
    'use strict';

    var type = 'Splash',
        Splash = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));
                
                // 获取页面中存在的闪屏canvas
                this.sprite = document.getElementById('splash');
            },
            mix: util.mix,
            hide: function () {
                log('view:' + this.type + ':' + this.uuid, 'hide');
                this.sprite.style.display = "none";
                var gameCanvas = document.getElementById('game_canvas');
                if(gameCanvas){
                    gameCanvas.style.display = "block";
                }
                var debugCanvas = document.getElementById('debug');
                if(debugCanvas){
                    debugCanvas.style.display = "block";
                }
            }
        });

    Splash.type = type;

    return Splash;
});