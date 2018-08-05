import Renderer from './Renderer'
import Easing from '../easing'

export default class SaneryiRenderer extends Renderer{
    constructor(url, num){
        super()
        this.url = url;
        this.num = num;
        this.globalAlpha = 1;
    }
    handleAction(action, startTime, now){
        if(action.type == 'opacity'){
            let dis = action.to - action.from;
            let es = Easing[action.easing || 'Linear'] || Easing.Linear;
            let target = es(now-startTime, action.from, dis, action.duration);
            this.globalAlpha = target;
        }else if(action.type == 'scale'){
            let dis = action.to - action.from
            let es = Easing[action.easing || 'Linear'] || Easing.Linear;
            let target = es(now-startTime, action.from, dis, action.duration);
            this.scale = target;
        }
    }
    renderNum(num, x, y, width, height, pen){
        pen.save();
        pen.setGlobalAlpha(this.globalAlpha);
        pen.scale(this.scale, this.scale);
        let offset = (num-1) * 198;
        pen.drawImage(this.url, 0, offset, 138, 198, x, y, width, height);
        pen.restore();
    }
    render(x, y, width, height, pen){
        this.renderNum(this.num, x, y, width, height, pen);
    }
}