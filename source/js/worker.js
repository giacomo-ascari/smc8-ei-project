https://glitch.com/edit/#!/p5js-web-worker?path=worker.js%3A55%3A50
//importScripts("p5.js");

importScripts("utils.js")
importScripts("perlin.js")
importScripts("chunk.js")


onmessage = (e) => {
    randomSpace = e.data.randomSpace;
    let chunk = new Chunk(e.data.spaceSize, e.data.frequency, e.data.xCorner, e.data.yCorner, e.data.scale, e.data.amplitude);
    chunk.build();
    postMessage(chunk);
};
