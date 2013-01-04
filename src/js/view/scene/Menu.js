/**
 * MainMenu
 *
 * @import ../../../lib/elf/core/lang.js
 * @import ../../../lib/elf/mod/class.js
 * @import ../../Config.js
 * @import ../../Util.js
 * @import ../mixin/EventMixin.js
 * @import ../mixin/MessageMixin.js
 * @import ../mixin/ElementMixin.js
 * @import ../mixin/StateMixin.js
 * @import ../mixin/Cocos2dMixin.js
 */
elf.define('FS::View::Menu', [
    'lang',
    'class',
    'FS::Config',
    'FS::Util',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin',
    'FS::View::Cocos2dMixin'
], function (_, Class, config, util, eventMixin, messageMixin, elementMixin, stateMixin, cocos2dMixin) {
    'use strict';
    
    // 主屏配置
    var config = {
        bgImg: "/public/img/main.png",
        bgRect: cc.rect(2, 0, 1000, 500),
        beginBtnImg: "/public/img/localized.png",
        beginBtnRect: cc.rect(0, 120, 160, 40),
        optionBtnImg: "/public/img/localized.png",
        optionBtnRect: cc.rect(225, 89, 150, 38),
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

            //var greenLayer = cc.LayerColor.create(cc.c4(0, 255, 0, 255), s.width, s.height);
            //this.addChild(greenLayer);
            //背景
            var bgSprite = cc.Sprite.create(config.bgImg, config.bgRect);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setScale(1.15, 1.55);  //临时放大
            bgSprite.setPosition(cc.p(0, 0));
            this.addChild(bgSprite);

            //开始按钮
            var beginBtn = cc.MenuItemImage.create();
            beginBtn.setEnabled(true);
            beginBtn.setCallback(this.beginGame, this);
            var beginBtnFrame = cc.SpriteFrame.create(config.beginBtnImg, config.beginBtnRect);
            beginBtn.setNormalSpriteFrame(beginBtnFrame);
            beginBtn.setPosition(cc.p(s.width/2, s.height/2));

            //选项按钮
            var optionBtn = cc.MenuItemImage.create();
            optionBtn.setEnabled(true);
            optionBtn.setCallback(this.gameOption, this);
            var optionBtnFrame = cc.SpriteFrame.create(config.optionBtnImg, config.optionBtnRect);
            optionBtn.setNormalSpriteFrame(optionBtnFrame);
            optionBtn.setPosition(cc.p(s.width/2, s.height/2 - 80));

            //title Label
            var titleLabel = cc.LabelTTF.create(
                config.label,
                config.labelFontType,
                config.labelFontSize, 
                config.labelSize,
                cc.TEXT_ALIGNMENT_CENTER);
            titleLabel.setColor(cc.c3(255, 255, 51));
            titleLabel.setPosition(cc.p(s.width/2, s.height/2 + 100));
            this.addChild(titleLabel);

            var gameMenu = cc.Menu.create(beginBtn, optionBtn);
            gameMenu.setPosition(cc.p(0, 0));
            this.addChild(gameMenu);
        },
        beginGame:function(){
            console.log("begin game");
            this.sendController('config', [{mode: 'multi-player'}]);
            this.sendController('game', ['start']);
        },
        gameOption:function(){
            console.log("option game");
            this.sendController('game', ['option']);
        }
    });

    // 主屏场景
    var MainMenuScene = cc.Scene.extend({
        onEnter: function () {
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
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin, cocos2dMixin);
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
                //cocos2dUtils.replaceScene(this.sprite, 'Fade', 0.5);
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

    Menu.type = type;

    return Menu;
});