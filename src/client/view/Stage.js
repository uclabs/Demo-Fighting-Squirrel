/**
 * Stage
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../../common/Util.js
 * @import Resources.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::View::Stage', [
    'lang',
    'class',
    'FS::Util',
    'FS::View::Resources',
    'FS::View::EventMixin',
    'FS::View::MessageMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, util, resources, eventMixin, messageMixin, elementMixin, stateMixin) {
    'use strict';
    
    var Point = resources.ccAnchorPoint,
        Sprite = function () {
            var stageBg = stageItems[0], 
                bg = cc.Sprite.create(stageBg.img, stageBg.rect),
                winSize = cc.Director.getInstance().getWinSize();
            bg.setAnchorPoint(stageBg.point);
            bg.setPosition(stageBg.position.x, stageBg.position.y);
            bg.setScale(winSize.width/stageBg.width, winSize.height/stageBg.height);
            return bg;
        },
        type = 'Stage',
        Stage = Class.extend({
            type: type,
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));
                
                // 创建 Cocos2d 对象
                this.sprite = Sprite();
            },
            mix: util.mix,
            stateHandler: function () {
               
            }
        });

    Stage.type = type;


    var stageItems = [
        {
            name: 'main',
            img: resources.s_main,
            width: 960,
            height: 640,
            rect: cc.rect(2, 2, 960, 640),
            point: Point.BL,
            position: {x: 0, y: 0}
        }
    ];

    return Stage;
});