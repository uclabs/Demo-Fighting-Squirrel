/**
 * Scene
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../../common/Util.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 * @import ../mixin/Cocos2dMixin.js
 */
elf.define('FS::View::Scene', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin',
    'FS::View::Cocos2dMixin'
], function (_, Class, util, eventMixin, messageMixin, elementMixin, stateMixin, cocos2dMixin) {
    'use strict';

    var Sprite = cc.Layer.extend({
            mix: util.mix,
            ctor: function () {
                this.mix(eventMixin, messageMixin, cocos2dMixin);
                this._super();
                cc.associateWithNative(this, cc.Layer);
            }
        }),
        type = 'Scene',
        Scene = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));

                // 派发场景创建消息
                //this.sendMessage('Scene:create', [this]);
                
                // 创建 Cocos2d 对象
                this.sprite = new Sprite();
            },
            mix: util.mix,
            stateHandler: function () {
            },
            // 改变回合方
            changeSide: function (side) {
                log('view:' + this.type + ':' + this.uuid, 'side', side);
            },
            // 切换到本场景
            replace: function (transition, time) {
                log('view:Scene:' + this.uuid, 'replace', transition, time);
                this.sprite.replaceScene(this.sprite, transition || 'Fade', time || 0);
            },
            addChild: function (uuid, zOrder, tag) {
                var child = this.elements[uuid];
                // this.sprite.addChild(child.sprite, zOrder || 1, tag || 1);
            }
        });

    Scene.type = type;

    return Scene;
});