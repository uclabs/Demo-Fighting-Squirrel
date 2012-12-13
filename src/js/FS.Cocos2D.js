/**
 * Cocos2D Module
 */
elf.define('cocos2d', function () {
    if (window.cc !== 'undefined') {
        return cc;
    }
});

elf.define('box2d', function () {
    if (window.Box2D !== 'undefined') {
        return Box2D;
    }
});