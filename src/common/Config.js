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
            uuid: 'nino',
            nickName: '尼诺',
            avatar: 0
        },
        // 游戏配置
        game: {
            music: false,
            language: 'zh-cn'
        },
        side: [
            {
                x: 100,
                y: 540,
                wx: 140,
                wy: 520 
            }
            ,
            {
                x: 920,
                y: 540,
                wx: 880,
                wy: 520
            }
        ],
        // 游戏世界定义
        world: {
            width: 1024,
            height: 768,
            scale: 30,
            gravity: 9.80665
        }
    };
});