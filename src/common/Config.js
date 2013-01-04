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
        // 玩家配置
        player: {
            nickName: '玩家',
            avatar: 0
        },
        // 游戏配置
        game: {
            music: false,
            language: 'zh-cn'
        },
        // 游戏世界定义
        world: {
            width: 1024,
            height: 768,
            scale: 30,
            gravity: 9.80665
        }
    };
});