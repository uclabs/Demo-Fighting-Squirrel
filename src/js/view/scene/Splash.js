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
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, util, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';

    var type = 'Splash',
        Splash = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));
                
                // 获取页面中存在的闪屏canvas
                this.sprite = document.getElementById('splash');
            },
            mix: util.mix,
            stateHandler: function () {
            },
            // 切换到本场景
            replace: function (transition, time) {
                log('view:' + this.type + ':' + this.uuid, 'replace', transition, time);
            }
        });

    Splash.type = type;

    return Splash;
});