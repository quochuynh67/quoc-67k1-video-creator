export function buildHtml(sceneHtml, bg, width, height) {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:${bg};}
#root{width:${width}px;height:${height}px;overflow:hidden;}
</style>
</head>
<body>
<div id="root">${sceneHtml}</div>
</body>
</html>`;
}
export function buildChunks(project) {
    return project.scenes.map((scene) => ({
        content: buildHtml(scene.html, scene.background, project.width, project.height),
        duration: scene.duration
    }));
}
