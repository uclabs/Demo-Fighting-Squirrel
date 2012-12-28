/**
 * Stage
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ../Util.js
 * @import Resources.js
 * @import mixin/EventMixin.js
 * @import mixin/ElementMixin.js
 * @import mixin/StateMixin.js
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
    var Sprite = function () {
            var bg = cc.Sprite.create(stageItems[0].img, cc.rect(1, 1, 480, 320)); 
                bg.setAnchorPoint(cc.p(0,0));
                bg.setPosition(0,  0);
            return bg;
        },
        Stage = Class.extend({
            type: 'Stage',
            ctor: function (opts) {
                this.mix(eventMixin, messageMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));
                
                // 创建 Cocos2d 对象
                this.sprite = Sprite();
            },
            mix: util.mix(),
            stateHandler: function () {
                alert(2);
            }
        });

    Stage.type = 'Stage';


    var stageItems = [
        {
            name: 'main',
            img: resources.s_main,
            width: 480,
            height: 320
        }
    ];

    return Stage;
});