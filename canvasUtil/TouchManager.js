const CLICK_INTERVAL = 2000;  // 点击到抬起两秒之内的都触发'click'事件
const MOVE_MIN_DIS = 10;  // 挪动要超过10px才触发touchmove
export default class TouchManager{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.start = null;
        this.moved = false;
        this.listeners = [];
        this.onTouchMove = this.onTouchMove.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.onTouchStart = this.onTouchStart.bind(this)
        this.onTouchCancel = this.onTouchCancel.bind(this)
    }
    setStart(x, y){
        this.start = {
            x, y, time: +(new Date)
        }
    }
    isSingleTouch(e){
        return (e.touches && e.touches.length == 1);
    }
    onTouchStart(e){
        if(!this.isSingleTouch(e)){ return }
        this.setStart(e.x, e.y)
        this.emit('touchstart', {
            e: e,
            start: this.start,
        })
    }
    onTouchMove(e){
        if(!this.isSingleTouch(e)){ return this.cancelTouch() }
        let x = e.x, y = e.y;
        if((Math.pow(x-this.start.x, 2)+Math.pow(y-this.start.y, 2)) < Math.pow(MOVE_MIN_DIS) && !this.moved){
            return;
        }
        this.moved = true;
        this.emit('touchmove', {
            e: e,
            start: this.start
        })
    }
    onTouchEnd(e){
        if(+(new Date) - this.start.time < CLICK_INTERVAL && !this.moved){
            // 先触发touchend
            this.emit('touchend', {e, start: this.start})
            this.emit('click', this.start)
        }
        if(this.moved){
            this.emit('touchend', { e, start: this.start, })
        }
        this.cancelTouch();
    }
    emit(type, obj){
        let listeners = this.listeners[type];
        if(!listeners || !listeners.length){ return }
        listeners.forEach(_=>_(obj)) 
    }
    on(type, handler){
        if(!this.listeners[type]){
            this.listeners[type] = [handler]
        }else{
            this.listeners[type].push(handler)
        }
    }
    off(type, handler){
        if(!this.listeners[type] || !this.listeners[type].length){
            return
        }
        this.listeners[type] = this.listeners[type].filter(_=>_!=handler);
    }
    onTouchCancel(e){
        this.emit('touchcancel');
        this.cancelTouch();
    }
    cancelTouch(){
        this.start = null;
        this.moved = false;
    }
}