export default class CanvasObject{
    constructor(x, y, width, height){
        this.cor = {
            x: x||0,
            y: y||0,
            width,
            height,
        };
    }
    redner(){
        console.info('stupid!! im abstruct, please implement the render method in subclass of CavansObject!!');
    }
}