export function randomNumInRange(left, right){
    return (Math.random() * (right - left) >>> 0) + left;
}