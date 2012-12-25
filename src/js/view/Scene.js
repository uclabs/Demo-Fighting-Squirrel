/**
 * Scene
 *
 * @import ../../lib/elf/core/lang.js
 * @import ../../lib/elf/mod/class.js
 * @import ./mixin/EventMixin.js
 * @import ./mixin/ElementMixin.js
 * @import ./mixin/StateMixin.js
 */
elf.define('FS::View::Scene', [
    'lang',
    'class',
    'FS::View::EventMixin',
    'FS::View::ElementMixin',
    'FS::View::StateMixin'
], function (_, Class, eventMixin, elementMixin, stateMixin) {
    'use strict';
    var Layer = cc.LayerGradient.extend({
        ctor:function() {
            this._super();
            cc.associateWithNative( this, cc.LayerGradient );
        },
        append: function (child, zOrder, tag) {
            this.addChild(child, zOrder || 1, tag || 1);
        }
    });
    Layer.append = function (child, zOrder, tag) {
        this.prototype.append(child, zOrder, tag);
    }

    var concat = Array.prototype.concat,
        Scene = Class.extend({
            type: 'Scene',
            scene: Layer,
            ctor: function (opts) {
                this.mix(eventMixin, elementMixin, stateMixin);
                this.config(opts);
                this.listenController(opts.uuid, this.invoke.bind(this));
            },
            mix: function () {
                _.extend.apply(_, concat.apply([true, this], arguments));
            },
            stateHandler: function () {
            },
            add: function (child, zOrder, tag) {
                this.scene.append(child, zOrder, tag);
            }
        });

    Scene.type = 'Scene';

    return Scene;
});