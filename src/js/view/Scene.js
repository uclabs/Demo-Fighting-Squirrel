/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/MessageMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::View::Scene', [
    'lang',
    'class',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';
    var concat = Array.prototype.concat,
        Sprite = cc.LayerGradient.extend({
            ctor: function () {
                this._super();
                // cc.associateWithNative( this, cc.LayerGradient );
            },
            addChild: function (child, zOrder, tag) {
                this.addChild(child, zOrder || 1, tag || 1);
            }
        }),
        Scene = Class.extend({
            type: 'Scene',
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));

                // 创建 Cocos2d 对象
                this.sprite = Sprite;
                // 派发场景创建消息
                this.sendMessage('Scene:create', [this]);
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            stateHandler: function () {
            },
            addChild: function() {
                for (var i = 0, len = arguments.length; i < len; i++) {
                    // 附加子元素
                }
            }
        });

    Scene.type = 'Scene';

    return Scene;
});