export default class Action{
    constructor(layer, ItemName, name){
        this.layer = layer;
        this.item = ItemName;
        this.name = name;
        this.queue = [];
        this.duration = 0;
        this.mileStone = [];
        this.currentMileStone = 0;
        this.from = null;
    }
    start(time){
        this.from = time;
        return this;
    }
    removeSelf(){
        this.from = 0;
        this.end = 1;
        return this;
    }
    reset(){
        this.from = null;
        this.queue = [];
        this.duration = 0;
        this.mileStone = [];
        this.currentMileStone = 0;
        return this;
    }
    move(config){
        if(config.length){
            config.forEach(_=>{
                _.type = 'move';
            })
            return this.anim(config);
        }else{
            config.type = 'move';
            return this.anim(config);
        }
    }
    stay(time){
        return this.anim({
            type: 'stay',
            duration: time || Infinity,
        })
    }
    anim(config){
        if(!this.from){
            this.from = Date.now();
        }
        if(config.length){
            this.duration += config[0].duration;
        }else{
            this.duration += config.duration;
        }
        this.mileStone.push(this.from+this.duration);
        this.end = this.from + this.duration;
        this.queue.push(config);
        return this;
    }
}


