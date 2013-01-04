/*
 * Cocos2dMixin
 *
 */

 elf.define('FS::View::Cocos2dMixin', [], function(){
    'use strict';
    
    var mixin = {
        replaceScene: function (scene, type, time) {
            if(!scene){
                return;
            }
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
    };
    
    return mixin;
 });