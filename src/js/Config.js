/**
 * Config
 */
elf.define('FS::Config', function () {
    'use strict';

    var frameRate = 30;
    
    return {
        // 输出日志开关
        log: true,
        // FPS
        frameRate: frameRate,
        // 帧间隔
        frameInterval: Math.floor(1000 / frameRate),
        // 游戏世界定义
        world: {
            width: 1024,
            height: 768,
            scale: 30,
            gravity: 9.80665
        },
        // Cocos2D Config
        ccConfig: {
            COCOS2D_DEBUG: 2, // 0 to turn debug off, 1 for basic debug, and 2 for full debug
            box2d: true,
            chipmunk: false,
            showFPS: true,
            frameRate: frameRate,
            loadExtension: false,
            tag: 'game_canvas', //the dom element to run cocos2d on
            engineDir: 'public/lib/cocos2d/',
            appFiles: []
        }
    };
});