import CanvasObject from './CanvasObject'
import NormalRenderer from './renderer/Renderer'
import Easing from './easing'

export default class Item extends CanvasObject {
    constructor(name, x, y, width, height){
        super(x, y, width, height)
        this.name = name;
        this.behaviors = [];
    }
    setRenderer(renderer){
        this.renderer = renderer;
    }
    addBehavior(be){
        this.behaviors.push(be);
    }
    removeBehaviors(beName){
        this.behaviors = this.behaviors.filter(_=>_.name != beName);
    }
    dealWithAction(action, startTime, now, log){
        if(action.type == 'move'){
            let xpath = action.to[0] - action.from[0];
            let ypath = action.to[1] - action.from[1];
            let es = Easing[action.easing || 'Linear'] || Easing.Linear;
            let _x = es(now-startTime, action.from[0], xpath, action.duration);
            let _y = es(now-startTime, action.from[1], ypath, action.duration);
            this.cor.x = _x;
            this.cor.y = _y;
        }else if(action.type == 'opacity'){
            let renderer = this.renderer;
            renderer.handleAction(action, startTime, now);
        }else if(action.type == 'stay'){
            console.info(_x, _y)
            // update the last state of prevMilestone
        }else if(action.type == 'img'){
            this.renderer.handleAction(action, startTime, now);
        }else if(action.type == 'scale'){
            this.renderer.handleAction(action, startTime, now);
        }
    } 
    render(pen, action, now){
        if(!this.renderer) return;
        if(!action){  //没有action的元素一般是静态的，一直存在在那的，位于bgLayer
            let cor = this.cor;
            this.renderer.render(cor.x, cor.y, cor.width, cor.height, pen);
        }else{   // 有action的动画元素是随时变动且可能消失的，action中定义了这个动画元素的关键帧。
            // 首先计算当前所在的动画阶段
            if(action.mileStone[action.currentMileStone]<now){
                action.currentMileStone = action.currentMileStone + 1;
            }
            let start = action.currentMileStone==0?action.from:action.mileStone[action.currentMileStone-1];
            // 然后动画对象根据动作行为改变自身状态、或者renderer的状态
            let behaviors = action.queue[action.currentMileStone];
            if(behaviors.length){
                behaviors.forEach(behavior=>this.dealWithAction(behavior, start, now))
            }else{
                if(behaviors.type == 'stay'){
                    // 如果是原地不动，保证停留的状态是上一次action的结束态
                    if(action.currentMileStone !=0){
                        let last = action.currentMileStone - 1;
                        let behavior = action.queue[last];
                        this.dealWithAction(behavior, last==0?action.from:action.mileStone[last-1], action.mileStone[last], true);
                    }
                }else{
                    this.dealWithAction(behaviors, start, now)
                }
            }

            // 最后渲染出来
            let cor = this.cor;
            this.renderer.render(cor.x, cor.y, cor.width, cor.height, pen);
        }
    }
}

