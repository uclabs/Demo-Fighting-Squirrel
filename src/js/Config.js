/**
 * Config
 */
elf.define('FS::Config', function () {
    return {
        // Cocos2D Config
        ccConfig: {
            COCOS2D_DEBUG: 2, // 0 to turn debug off, 1 for basic debug, and 2 for full debug
            box2d: true,
            chipmunk: false,
            showFPS: true,
            frameRate: 30,
            loadExtension: false,
            tag: 'stage', //the dom element to run cocos2d on
            engineDir: 'public/lib/cocos2d/',
            appFiles: []
        }
    };
});