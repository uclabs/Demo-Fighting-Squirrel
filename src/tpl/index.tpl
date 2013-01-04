<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="HandheldFriendly" content="true">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    {{=tpl.genTags('css', data.cssFiles) }}
    <title>战斗吧，松鼠！- Fighting Squirrel</title>
    {{=tpl.genTags('js', data.jsFiles) }}
</head>
<body>

<div style="width:1024px;margin:0 auto;background:black">
    <canvas id="game_canvas" width="1024" height="768" style="display:none;"></canvas>
</div>
<canvas id="splash" width="1024" height="768"></canvas>
<!-- <canvas id="scene" width="1024" height="768"></canvas>
 --><canvas id="debug" width="1024" height="768" style="display:none;"></canvas>

<script>
elf.require(['FS::CCConfig'], function (ccConfig) {
    window.addEventListener('DOMContentLoaded', function () {
        var cfg = document.ccConfig = ccConfig,
            script = document.createElement('script');
        script.id = 'cocos2d-html5';
        script.src = cfg.engineDir + 'platform/jsloader.js';
        document.body.appendChild(script);
    });
});
</script>

</body>
</html>