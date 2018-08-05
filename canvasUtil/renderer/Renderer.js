import Easing from '../easing'

export default class Renderer{
    constructor(){

    }
    handleAction(action, startTime, now){
        if(action.type == 'opacity'){
            let dis = action.to - action.from;
            let es = Easing[action.easing || 'Linear'] || Easing.Linear;
            let target = es(now-startTime, action.from, dis, action.duration);
            this.globalAlpha = target;
        }
    }
}