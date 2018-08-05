/**
 * canvas 画布上的层的抽象。一个画布上有很多层(Layer)，每一layer上有很多动画对象(Item)。每一个Item上可能注册很多行为(behavior)。
 * Timer对象是整个画布生命周期的时序控制器，它管理raf的启动与停止。
 * Engine对象是一切的管理者
 */
export default class Layer{
    constructor(){
        this.items = [];
    }
    addItem(item){
        this.items.push(item);
    }
    getItem(itemName){
        return this.items.filter(_=>_.name == itemName)[0]
    }
    removeItem(itemName){
        if(!itemName){
            return console.warn('stupid!! Layer.removeItem need itemName');
        }
        this.items = this.items.filter(_=>_.name != itemName);
    }

}