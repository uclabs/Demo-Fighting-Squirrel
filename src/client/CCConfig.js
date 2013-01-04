/**
 * CCConfig
 *
 * @import ../common/Config.js
 */
elf.define('FS::CCConfig', [
    'FS::Config'
], function (config) {
    'use strict';
    
    return {
        COCOS2D_DEBUG: 2, // 0 to turn debug off, 1 for basic debug, and 2 for full debug
        box2d: true,
        chipmunk: false,
        showFPS: true,
        frameRate: config.frameRate,
        loadExtension: false,
        tag: 'game_canvas', //the dom element to run cocos2d on
        engineDir: 'public/lib/cocos2d/',
        appFiles: []
    };
});