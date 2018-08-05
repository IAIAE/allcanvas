import Renderer from './Renderer'

export default class GiftRenderer extends Renderer{
    constructor(imgurl, logo){
        super()
        this.url = imgurl;
        this.selfLogo = logo;
    }
    render(x, y, width, height, pen){
        if(this.globalAlpha != null){
            pen.save();
            pen.setGlobalAlpha(this.globalAlpha);
            pen.drawImage(this.url, x, y, width, height);
            pen.drawImage(this.selfLogo, x+7, y+12, 28.5, 28.5);
            pen.restore();
        }else{
            pen.drawImage(this.url, x, y, width, height);
            pen.drawImage(this.selfLogo, x+7, y+12, 28.5, 28.5);
        }
    }

}