import Renderer from './Renderer'

const DEFAULT_CONFIG = {
}
export default class TextRenderer extends Renderer{
    constructor(text){
        super()
        this.text = text;
        this._defaultConfig = {

        }
    }
    setText(text){
        this.text = text;
    }
    config(conf){
        this.config = Object.assign(this._defaultConfig, conf);
        return this;
    }
    render(x, y, width, height, pen){
        pen.save();
        this.config.fontSize && pen.setFontSize(this.config.fontSize);
        this.config.color && pen.setFillStyle(this.config.color)
        pen.fillText(this.text, x, y);
        pen.restore();
    }
}