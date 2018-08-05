import Item from './Item'
import Layer from './Layer'
import config from '../config'
import {getDevice} from '@/common/device'
import ImageRenderer from './renderer/ImageRenderer';
import GiftRenderer from './renderer/GiftRenderer'
import TextRenderer from './renderer/TextRenderer'
import MoneyRenderer from './renderer/MoneyRenderer'
import TimeRenderer from './renderer/TimeRenderer'
import SaneryiRender from './renderer/SaneryiRender'
import MessageRenderer from './renderer/MessageRenderer'
import requestAnimationFrame from './raf'
import {randomNumInRange} from './tool'
import Action from './Action'

const raf = requestAnimationFrame;
const imgConfig = config.imgFiles
const device = getDevice()
const canvasWidth = device.windowWidth;
const canvasHeight = device.windowHeight;

const X_OFFSET = 15;
const DAOJISHI_TOTAL = 15;
const TOTAL_MONEY = 999999;

export default class CavasEngine{
    constructor(pen){
        this.isBegin = false;
        this.pen = pen;
        this.bg = null;
        this.actions = [];
        this.actionStack = [];
        this.comboCount = 0;
        this.messageCount = 0;
        this.userLogo = null;
        this.buttonAction = null;
    }
    setImageMap(imgMap){
        this.imgMap = imgMap; 
    }
    addAction(action){
        this.actions.push(action);
    }
    findAction(actionName){
        return this.actions.filter(_=>_.name==actionName)[0];
    }
    addGift(actionId){
        this.actionStack.unshift(actionId);
        if(this.actionStack.length>3){
            let removed = this.actionStack.pop();
            return removed;
        }
    }
    moveGiftUp(needUpdateActionIds, disappear){
        let items = needUpdateActionIds.map(id=>this.layers[1].getItem('gift'+id)).map(item=>item.cor);
        needUpdateActionIds.map(id=>this.findAction('giftAction-'+id)).forEach((action, index)=>{
            if(!disappear){
                action.reset().move({
                    from: [X_OFFSET, items[index].y],
                    to: [X_OFFSET, items[index].y - 50],
                    duration: 100,
                }).stay();
            }else{
                action.removeSelf()
            }
        })
        let combs = needUpdateActionIds.map(id=>this.layers[1].getItem('giftCombo'+id)).map(item=>item.cor);
        needUpdateActionIds.map(id=>this.findAction('comboAction-'+id)).forEach((action, index)=>{
            if(disappear==null){
                action.reset().move({
                    from: [X_OFFSET+155, combs[index].y],
                    to: [X_OFFSET+155, combs[index].y - 50],
                    duration: 100,
                }).stay();
            }else{
                action.removeSelf()
            }
        })
    }
    touchstart(){
        if(!this.isBegin) return;
        this.buttonAction.reset()
            .anim({
                type: 'img',
                src: this.imgMap[imgConfig.buttonActive.name],
                duration: Infinity,
            })
        this.tick();
    }
    touchend(){
        if(!this.buttonAction) return;
        this.buttonAction.reset()
            .anim({
                type: 'img',
                src: this.imgMap[imgConfig.button.name],
                duration: Infinity,
            }).stay()
    }
    newMessageEx(){
        if(!this.isBegin) return;
        let id = Math.random()*5 >>> 0;
        this.messageCount++;
        let text = config.messages[id]
        let message = new Item('message'+this.messageCount, -130, 100, 127, 30)
        message.setRenderer(new MessageRenderer(this.imgMap[imgConfig.message.name], text));
        let action = new Action(1, 'message'+this.messageCount, 'messageAction'+this.messageCount);
        action.start(Date.now()+10)
            .move({
                from: [-130, 100],
                to: [10, 100],
                duration: 300,
            }).stay(2000)
            .move({
                from: [10, 100],
                to: [-130, 100],
                duration: 300,
            })
        this.layers[1].addItem(message)
        this.addAction(action)
    }
    newMessage(){
        if(!this.isBegin) return;
        let id = Math.random()*5 >>> 0;
        this.messageCount++;
        let text = config.messages[id];
        let duration = randomNumInRange(2000, 4000);
        let yOffset = randomNumInRange(100, 220);
        let message = new Item('message'+this.messageCount, canvasWidth + 10, yOffset, 127, 30);
        message.setRenderer(new MessageRenderer(this.imgMap[imgConfig.message.name], text))
        let action = new Action(1, 'message'+this.messageCount, 'messageAction'+this.messageCount);
        action.start(Date.now()+10)
            .move({
                from: [canvasWidth+10, yOffset],
                to: [-130, yOffset],
                duration,
            });
        this.layers[1].addItem(message)
        this.addAction(action)
    }
    newGift(){
        if(!this.isBegin) return;
        let id = Math.random()*3 >>> 0;
        let cost = [1090,934,663];
        this.money -= cost[id];
        this.layers[0].getItem('money').renderer.money = this.money;
        this.comboCount += 1;
        let actionId = this.comboCount;
        // console.info('this', this.actionStack)
        let needRemovedAction = this.addGift(actionId);
        /**
         * 更新已有的gift的位移
         */
        let needUpdateActionIds = this.actionStack.slice(1);
        this.moveGiftUp(needUpdateActionIds);
        /**
         * 删除最上层的那个礼物框
         */
        if(needRemovedAction!=null){
            this.moveGiftUp([needRemovedAction], true); 
        }
        /**
         * 然后添加新的礼物
         */
        let newGift = new Item('gift'+actionId, -200, -200, 149, 44.75);
        newGift.setRenderer(new GiftRenderer(this.imgMap[imgConfig['gift'+id].name], this.userLogo)) 
        let giftAction = new Action(1, 'gift'+actionId, 'giftAction-'+actionId)
            .start(Date.now() + 10)
            .anim({
                type: 'move',
                from: [-200, 400],
                to: [15, 400],
                duration: 200,
                easing: 'easeOutQuint',
            })
            .anim({
                type: 'stay',
                duration: Infinity,
            })
        let giftCombo = new Item('giftCombo'+actionId, -100, -200, 50, 50);
        giftCombo.setRenderer(new TextRenderer('x'+this.comboCount).config({
            fontSize: 24,
        }));
        let comboAction = new Action(1, 'giftCombo'+actionId, 'comboAction-'+actionId)
            .start(Date.now() + 10)
            .anim({
                type: 'move',
                from: [-35, 430],
                to: [170, 430],
                duration: 200,
                easing: 'easeOutQuint',
            })
            .anim({
                type: 'stay',
                duration: Infinity,
            })
        this.layers[1].addItem(newGift)
        this.layers[1].addItem(giftCombo)
        this.addAction(giftAction)
        this.addAction(comboAction);
        this.tick();
    }
    init(whichAnchor, userLogo){
        this.money = TOTAL_MONEY;
        this.userLogo = userLogo;
        this.whichAnchor = whichAnchor;
        // console.info('config is ', [imgConfig.button.name])
        // 初始化所有动画对象，然后初始化所有层
        let logoBorder = new Item('logoBorder', 0, 0, 298, 89.5);
        logoBorder.setRenderer(new ImageRenderer(this.imgMap[imgConfig.logoBorder.name])) 
        let daojishi = new Item('daojishi', canvasWidth-51, 287, 51, 150.5)
        daojishi.setRenderer(new ImageRenderer(this.imgMap[imgConfig.daojishi.name]))
        let logo = new Item('logo', 26, 15, 63.5, 63.5);
        logo.setRenderer(new ImageRenderer(this.imgMap[imgConfig['anchor'+whichAnchor].name]))
        let name = new Item('name', 105, 50);
        name.setRenderer(new TextRenderer(imgConfig['anchor'+whichAnchor].anchorName+'的直播间').config({
            fontSize: 19,
        }));
        let coinBorder = new Item('coinBorder', 0, canvasHeight - 77, 346, 77);
        coinBorder.setRenderer(new ImageRenderer(this.imgMap[imgConfig.coinBorder.name]));
        let money = new Item('money', 80, canvasHeight-66, 200, 50 )        
        money.setRenderer(new MoneyRenderer(this.imgMap[imgConfig.nums.name], this.money))
        let time = new Item('time', canvasWidth-36, 300, 30, 130)
        time.setRenderer(new TimeRenderer(DAOJISHI_TOTAL));
        // 分为三层，从下往上分别是：背景层、动画层、和交互层。
        let bgLayer = new Layer();
        bgLayer.addItem(logoBorder)
        bgLayer.addItem(daojishi)
        bgLayer.addItem(logo)
        bgLayer.addItem(name)
        bgLayer.addItem(coinBorder)
        bgLayer.addItem(money)
        bgLayer.addItem(time)
        
        let animLayer = new Layer()

        let activeLayer = new Layer();

        this.layers = [bgLayer, animLayer, activeLayer];
    }
    updateDaojishi(now){
        let pass = now - this.startTime
        let time = Math.max(0, DAOJISHI_TOTAL - (pass/1000>>>0))
        this.layers[0].getItem('time').renderer.setTime(time);
        if(time == 0 && !this.ToResult){
            this.ToResult = true
            this.gameEnd();
        }
    }
    gameEnd(){
        this.isBegin = false;
        let comboCount = this.comboCount;
        let money = TOTAL_MONEY - this.money;
        wx.navigateTo({url:'../activityResult/main?comboCount='+comboCount+'&anchorType='+this.whichAnchor+'&money='+money})
    }
    tick(){
        clearTimeout(this.timer)
        this.timer = raf(_=>{
            if(this.actions.length){
                let now = Date.now();
                this.updateDaojishi(now);
                let outOfDateAction = this.actions.filter(_=>(_.end<now));
                // console.info('this.actions', this.actions.length, outOfDateAction.length)
                if(outOfDateAction.length){
                    // 剔除已经不用显示的action对应的item
                    outOfDateAction.forEach(action=>{
                        this.layers[action.layer].removeItem(action.item);
                    })
                }
                let actionsFilter = this.actions.filter(_=>(_.end>=now))
                this.actions = actionsFilter;
                let doActions = actionsFilter.filter(_=>(_.from<=now && _.end>now));
                if(doActions.length){
                    this.pen.clearRect(0, 0, canvasWidth, canvasHeight)
                    // 首先绘制背景
                    this.layers[0].items.forEach(_=>_.render(this.pen));
                    // 然后绘制动画层或者交互层的元素
                    doActions.forEach(action=>{
                        let item = this.layers[action.layer].getItem(action.item)
                        if(!item){ return; }
                        item.render(this.pen, action, now);
                    });
                    this.pen.draw();
                }
            }
            if(this.actions.length){
                this.tick();
            }
        });
    }
    saveBg(){
        return new Promise((done, notDone)=>{
            wx.canvasGetImageData({
                canvasId: 'canvas',
                x: 0,
                y: 0,
                width: canvasWidth,
                height: canvasHeight,
                success(res) {
                    done(res.data);
                },
                fail(e){
                    console.info('canvas save Image data error', e)
                    notDone(e); 
                }
            })
        })
    }
    render321(){
        ;['san', 'er', 'yi'].forEach((name, index)=>{
            let item = new Item(name, (canvasWidth-69)/2, (canvasHeight-99)/2, 69, 99);
            item.setRenderer(new SaneryiRender(this.imgMap[imgConfig.saneryi.name], 3-index))
            let action = new Action(2, name, name+'Action')
                .start(Date.now()+10+index*1000)
                .anim([{
                    type: 'scale',
                    from: 0.4,
                    to: 1,
                    duration: 400,
                    easing: 'easeOutQuint'
                }, {
                    type: 'opacity',
                    from: 0,
                    to: 1,
                    duration: 400,
                }])
                .stay(600)
            this.layers[2].addItem(item);
            this.addAction(action);
            this.tick();
        })
    }
    renderCover(){
        this.pen.clearRect(0,0, canvasWidth, canvasHeight)
        this.pen.drawImage(this.imgMap[imgConfig.startCover.name], 0, 0, canvasWidth, canvasHeight)
        let layer = this.layers[0]
        layer.getItem('logoBorder').render(this.pen)
        layer.getItem('logo').render(this.pen)
        layer.getItem('name').render(this.pen)
        layer.getItem('coinBorder').render(this.pen)
        layer.getItem('money').render(this.pen)
        this.pen.drawImage(this.imgMap[imgConfig.startButton.name], (canvasWidth - 284.5)/2, canvasHeight*0.75, 284.5, 56.5);
        this.pen.draw()
    }
    renderInit(){
        this.pen.clearRect(0, 0, canvasWidth, canvasHeight)
        let layers = this.layers;
        for(let i=0;i<layers.length;i++){
            let layer = layers[i]
            layer.items.forEach(item=>{
                item.render(this.pen);
            })
        }
        // this.pen.fillRect(canvasWidth-36, 300, 30, 130)
        this.pen.draw();
        setTimeout(()=>{
            this.render321();
        }, 400)
        setTimeout(()=>{
            let rate = canvasWidth/375;
            let button = new Item('button', 28.5*rate, canvasHeight-175, 316.5*rate, 77.5*rate);
            button.setRenderer(new ImageRenderer(this.imgMap[imgConfig.button.name]));
            this.layers[2].addItem(button)
            this.buttonAction = new Action(2, 'button', 'buttonAction').stay()
            this.addAction(this.buttonAction)
            this.isBegin = true;
            this.startTime = Date.now();
            this.tick();
        }, 3500);
    }
}