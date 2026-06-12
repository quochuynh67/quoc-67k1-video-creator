function buildHtml(scene, width, height) {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:${scene.background};}
#root{width:${width}px;height:${height}px;overflow:hidden;}
</style>
</head>
<body>
<div id="root">${scene.html}</div>
</body>
</html>`;
}
export function buildChunks(project) {
    return project.scenes.map((scene) => {
        const chunk = { duration: scene.duration };
        if (scene.sourceType === "url" && scene.url) {
            chunk.url = scene.url;
        }
        else {
            chunk.content = buildHtml(scene, project.width, project.height);
        }
        if (scene.transition) {
            chunk.transition = { id: scene.transition.id, duration: scene.transition.duration };
        }
        if (scene.startTime > 0) {
            chunk.startTime = scene.startTime;
        }
        if (!scene.autostartRender) {
            chunk.autostartRender = false;
        }
        return chunk;
    });
}
