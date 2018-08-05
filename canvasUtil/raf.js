// var lastFrameTime = 0;
// // 模拟 requestAnimationFrame
// var requestAnimationFrame = function (callback) {
//     var currTime = new Date().getTime();
//     var timeToCall = Math.max(0, 16 - (currTime - lastFrameTime));
//     var id = setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
//     lastFrameTime = currTime + timeToCall;
//     return id;
// };
const requestAnimationFrame = _=>setTimeout(_, 16.7);
export default requestAnimationFrame; 