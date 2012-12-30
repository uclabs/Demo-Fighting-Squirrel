/**
 * MainMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 * @impirt ../cocos2dUtils.js
 */
elf.define('FS::View::Menu', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin',
    'FS::View::Cocos2dUtils'
], function (_, Class, util, eventMixin, messageMixin, elementMixin, stateMixin, cocos2dUtils) {
    'use strict';
    
    // 主屏配置
    var config = {
        bgImg: "../img/main.png",
        bgRect: cc.rect(0, 0, 1000, 700),
        beginBtnImg: "../img/localized",
        beginBtnRect: cc.rect(0, 0, 200, 200),
        optionBtnImg: "../img/localized",
        optionBtnRect: cc.rect(0, 0, 200, 200),
        label: "战斗吧，松鼠",
        labelSize: cc.size(200, 200),
        labelFontSize: 32,
        labelFontType: "Times New Roman",
    }

    // 主屏层
    var MainMenuLayer = cc.Layer.extend({
        mix: util.mix,
        init:function(){
            console.log("abc");
            this.mix(eventMixin);
            var s = cc.Director.getInstance().getWinSize();

            var greenLayer = cc.LayerColor.create(cc.c4(0, 255, 0, 255), s.width, s.height);
            this.addChild(greenLayer);
            //背景
            var bgSprite = cc.Sprite.create(config.bgImg, config.bgRect);
            bgSprite.setPosition(cc.p(0, 0));
            this.addChild(bgSprite);

            //开始按钮
            var beginBtn = cc.MenuItemImage.create();
            beginBtn.setCallback(this.beginGame);
            var beginBtnFrame = cc.SpriteFrame.create(config.beginBtnImg, config.beginBtnRect);
            beginBtn.setNormalSpriteFrame(beginBtnFrame);
            beginBtn.setPosition(cc.p(s.width/2 - 100, s.height/2));

            //选项按钮
            var optionBtn = cc.MenuItemImage.create();
            optionBtn.setCallback(this.gameOption);
            var optionBtnFrame = cc.SpriteFrame.create(config.optionBtnImg, config.optionBtnRect);
            optionBtn.setNormalSpriteFrame(optionBtnFrame);
            optionBtn.setPosition(cc.p(s.width/2 - 100, s.height/2 - 100));

            //title Label
            var titleLabel = cc.LabelTTF.create(
                config.label,
                config.labelFontType,
                config.labelFontSize, 
                config.labelSize,
                cc.TEXT_ALIGNMENT_CENTER);
            titleLabel.setPosition(cc.p(s.width/2 - 100, s.height/2 + 100));
            this.addChild(titleLabel);
            this.addChild(beginBtn);
            this.addChild(optionBtn);
        },
        beginGame:function(){
            this.sendController('config', [{mode: 'multi-player'}]);
            this.sendController('game', ['start']);
        },
        gameOption:function(){
            this.sendController('game', ['option']);
        }
    });

    // 主屏场景
    var MainMenuScene = cc.Scene.extend({
        onEnter:function(){
            this._super();
            var mainLayer = new MainMenuLayer();
            mainLayer.init();
            this.addChild(mainLayer);
        }
    });

    var type = 'Menu',
        Menu = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));

                // 派发场景创建消息
                //this.sendMessage('Scene:create', [this]);
                this.sprite = new MainMenuScene();
            },
            mix: util.mix,
            stateHandler: function () {
            },
            // 切换到本场景
            replace: function (transition, time) {
                log('view:' + this.type + ':' + this.uuid, 'replace', transition, time);
                // 由于没有界面，先用计时器模拟玩家延迟点击“开始游戏”按钮
                var that = this;


                console.log("replace with menu main");
                var tranScene = cc.TransitionMoveInL.create(0.5, this.sprite);
                cc.Director.getInstance().replaceScene(tranScene);
                /*setTimeout(function () {
                    // 向 manager 发送游戏开始的消息
                    that.sendController('config', [{mode: 'multi-player'}]);
                    that.sendController('game', ['start']);
                }, 1000);*/
                // this.sprite.replaceScene(this.sprite, transition || 'Fade', time || 0);
            },
            addChild: function (uuid, zOrder, tag) {
                var child = this.elements[uuid];
            }
        });

    //绑定初始化事件
    Menu.type = type;

    return Menu;
});