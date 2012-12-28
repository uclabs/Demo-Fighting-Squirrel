/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../Util.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/MessageMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
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
            }
        }),
        Scene;
    Sprite.create = function () {
        var sg = new Sprite();
        if (sg && sg.init()) {
            return sg;
        }
        return null;
    };
    Sprite.scene = function () {
        var scene = cc.Scene.create();
        var layer = Sprite.create();
        scene.addChild(layer);
        return scene;
    };   
    Scene = Class.extend({
        type: 'Scene',
        ctor: function (opts) {
            this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
            this.config(opts);
            this.listenController(opts.uuid, this.invoke.bind(this));

            // 派发场景创建消息
            this.sendMessage('Scene:create', [this]);
            
            // 创建 Cocos2d 对象
            this.sprite = new Sprite.scene ();
           
        },
        mix: util.mix(),
        stateHandler: function () {
        },
        // 改变回合方
        changeSide: function(side) {
            log('view:' + this.type + ':' + this.uuid, 'side', side);
        },
        addChild: function(child, zOrder, tag) {
            this.sprite.addChild(child, zOrder || 1, tag || 1);
        }
    });

    Scene.type = 'Scene';

    return Scene;
});