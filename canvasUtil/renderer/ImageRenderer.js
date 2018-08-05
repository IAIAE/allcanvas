import Renderer from './Renderer'

export default class ImageRenderer extends Renderer{
    constructor(imgurl){
        super()
        this.url = imgurl;
    }
    handleAction(action, startTime, now){
        if(action.type == 'img'){
            if(action.src){
                this.url = action.src;
            }
        }else{
            super.handleAction.call(this, action, startTime, now);
        }
    }
    render(x, y, width, height, pen){
        if(this.globalAlpha != null){
            pen.save();
            pen.setGlobalAlpha(this.globalAlpha);
            pen.drawImage(this.url, x, y, width, height);
            pen.restore();
        }else{
            pen.drawImage(this.url, x, y, width, height);
        }
    }
}