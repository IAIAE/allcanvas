import Renderer from './Renderer'

export default class MessageRenderer extends Renderer{
    constructor(imgurl, text){
        super()
        this.url = imgurl;
        this.text = text;
        this.config = {};
    }
    config(conf){
        this.config = Object.assign({}, this.config, conf)
    }
    render(x, y, width, height, pen){
        pen.save();
        this.config.fontSize && pen.setFontSize(this.config.fontSize);
        this.config.color && pen.setFillStyle(this.config.color);
        pen.drawImage(this.url, x, y, width, height);
        pen.fillText(this.text, x + 30, y +14)
        pen.restore();
    }

}