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
 */
elf.define('FS::View::Scene', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, util, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';

    var Sprite = cc.Layer.extend({
            ctor: function () {
                this._super();
                cc.associateWithNative( this, cc.Layer );
            },
            replaceScene: function (Sprite, type, time) {
                var scene = cc.Scene.create(),
                    transition = null;
                scene.addChild(Sprite);
                switch (type) {
                    case 'Fade' :      //淡出前一场景
                        transition = cc.TransitionFade.create(time, scene);
                        break;
                    case 'JumpZoom':   //跳跃式替换，场景缩小，再加载进来
                        transition = cc.TransitionJumpZoom.create(time, scene);
                        break;
                    case 'ShrinkGrow': //交叉着替换场景
                        transition = cc.TransitionShrinkGrow.create(time,scene);
                        break;
                    case 'RotoZoom':   //转换角度替换
                        transition = cc.TransitionRotoZoom.create(time,scene);
                        break;
                    case 'MoveInL':     //从左切入
                        transition = cc.TransitionMoveInL.create(time, scene);
                        break;
                    case 'MoveInR':     //从右切入
                        transition = cc.TransitionMoveInR.create(time, scene);
                        break;
                }
                cc.Director.getInstance().replaceScene(transition);
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
                log('view:' + this.type + ':' + this.uuid, 'replace', transition, time);
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