/**
 * Resources
 */
elf.define('FS::View::Resources', function () {
    'use strict';

    var dirImg = "/public/img/",
        dirMusic = "/public/music/";

    //图片
    var s_main = dirImg + "main.png",
        s_logo = dirImg + "logo.png",
        s_localized = dirImg + "localized.png",
        s_prologue = dirImg + "prologue.png";

    //锚点
    var AnchorPointBottomLeft = new cc.Point(0, 0),
        AnchorPointBottomRight = new cc.Point(1, 0),
        AnchorPointCenter = new cc.Point(0.5, 0.5),
        AnchorPointTop = new cc.Point(0.5, 1),
        AnchorPointTopRight = new cc.Point(1, 1),
        AnchorPointRight = new cc.Point(1, 0.5),
        AnchorPointBottom = new cc.Point(0.5, 0),
        AnchorPointLeft = new cc.Point(0, 0.5),
        AnchorPointTopLeft = new cc.Point(0, 1);


    return {
        s_main: s_main,
        s_logo: s_logo,
        s_localized: s_localized,
        s_prologue: s_prologue,

        // AnchorPoint
        ccAnchorPoint : {
            BR: AnchorPointBottomRight,
            BL: AnchorPointBottomLeft
        },

        // ccRessources
        ccRessources : [
            //image
            {type: "image", src: s_main},
            {type: "image", src: s_logo},
            {type: "image", src: s_localized},
            {type: "image", src: s_prologue}

            //music    

            //effect
        ]
    };
});