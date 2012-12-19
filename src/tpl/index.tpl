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
<canvas id="splash"></canvas>
<canvas id="scene"></canvas>
<script>
elf.require(['FS::Config'], function (config) {
    window.addEventListener('DOMContentLoaded', function () {
        var cfg = document.ccConfig = config.ccConfig,
            script = document.createElement('script');
        script.id = 'cocos2d-html5';
        script.src = cfg.engineDir + 'platform/jsloader.js';
        document.body.appendChild(script);
    });
});
</script>
</body>
</html>