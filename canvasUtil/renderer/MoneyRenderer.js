import Renderer from './Renderer'

export default class MoneyRenderer extends Renderer{
    constructor(url, money){
        super()
        this.url = url;
        this.money = money;
    }
    renderNum(num, x, y, width, height, pen){
        let offset = num * 78;
        pen.drawImage(this.url, 0, offset, 52, 78, x, y, width, height);
    }
    render(x, y, width, height, pen){
        let nums = (''+this.money).split('')
        let numWidth = height*52/78 >>>0;
        nums.map((num, index)=>this.renderNum(+num, x+numWidth*index, y, numWidth, height, pen))
    }
}