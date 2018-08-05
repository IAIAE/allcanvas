import Renderer from './Renderer'

const h = 24;
export default class TimeRenderer extends Renderer{
    constructor(time){
        super()
        this.time = time;
    }
    setTime(time){
        this.time = time;
    }
    render(x, y, width, height, pen){
        pen.save();
        pen.setTextBaseline('top')
        pen.setTextAlign('left')
        pen.font = 'italic 22px sans-serif';
        pen.fillText('倒', x, y);
        pen.fillText('计', x, y+h);
        pen.fillText('时', x, y+h*2);
        pen.fillText(this.time, x, y+h*3)
        pen.fillText('秒', x, y+h*4)
        pen.restore();
    }
}