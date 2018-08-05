import { getDevice } from "@/common/device";
import TouchManager from "./canvasUtil/TouchManager";
import {loadInitImage, loadUserLogo} from './sourceUtil/imgUtil'
import CanvasEngine from './canvasUtil/CanvasEngine'
// story是整个游戏的脚本
import story from './canvasUtil/story'
import config from './config'
import Item from './canvasUtil/Item';
import Action from './canvasUtil/Action'

export default {
  canvasWidth: null,
  canvasHeight: null,
  imgMap: null,
  pen: null,
  touchManager: null,
  canvasEngine: null,
  imgLoading: false,
  lastClickTime: 0,

  config: {
    disableScroll: true
  },
  components: {},

  data() {
    return {
      canvasHeight: 300,
      touchManager: null,
    };
  },
  computed: {},
  methods: {
    _beforeDestroy() {
      this.pen = null;
      this.touchManager = null;
      this.imgMap = null;
      this.startPharse = true;
    },
    back(e) {
      wx.navigateBack({ delta: 1 });
    },
    isInStartButton(start){
      if(!this.buttonBound){
        this.buttonBound = {
          xl: 48.5*this.rate,
          xh: 325*this.rate,
          yl: (this.canvasHeight/2)-160,
          yh: ((this.canvasHeight/2)-160+50.5*this.rate)
        }
      }
      return (start.x>this.buttonBound.xl)&&(start.x<this.buttonBound.xh)&&(start.y>this.buttonBound.yl)&& (start.y<this.buttonBound.yh)
    },
    isInButton(start){
      if(!this.buttonBound){
        this.buttonBound = {
          xl: 28.5*this.rate,
          xh: 345*this.rate,
          yl: (this.canvasHeight/2)-175,
          yh: ((this.canvasHeight/2)-175+77.5*this.rate)
        }
      }
      return (start.x>this.buttonBound.xl)&&(start.x<this.buttonBound.xh)&&(start.y>this.buttonBound.yl)&& (start.y<this.buttonBound.yh)
    },
    onTouchStart({ e, start }) {
      if(this.isInButton(start)){
        this.canvasEngine.touchstart();
      }
    },
    onTouchEnd({ e, start }) {
      if(this.isInButton(start)){
        this.canvasEngine.touchend();
      }
    },
    onTouchMove({ e, start }) {

    },
    onClick(start) {
      if(this.startPharse){
        if(this.isInStartButton(start)){
          this.startPharse = false;
          this.canvasEngine.renderInit();
        }
      }else{
        if(this.isInButton(start)){
          this.canvasEngine.newGift();
          if(Math.random()>0.9){
            this.canvasEngine.newMessage();
          }
        }
      }
    },
    onLongTouch(e) {

    },
    drawInitFirstScreen() {
      this.canvasEngine.setImageMap(this.imgMap)
      this.canvasEngine.init(this.whichAnchor, this.selfLogo);
      this.canvasEngine.renderCover();
      // this.canvasEngine.renderInit();
    },
    onTouchCancel(){
      this.canvasEngine.touchend();  
    },
    onCanvasError(e) {
      console.info("canvas error", e);
    },
    loadImageSource(){
      if(this.imgLoading){
        return;
      }
      wx.showLoading({
        title: '游戏资源加载中',
        mask: true,
      })
      this.imgLoading = true;
      Promise.all([loadUserLogo(),
      loadInitImage()]).then(arr=>{
        this.selfLogo = arr[0];
        let data = arr[1];
        this.imgLoading = false;
        this.imgMap = data; 
        wx.hideLoading();
        this.renderAfter && this.drawInitFirstScreen();
      }).catch(e=>{
        this.imgLoading = false;
        console.info('loadinitimg error', e);
      })
    }
  },

  onLoad(param) {
    // console.info('on load')
    this.startPharse = true;
    const queryData = param;
    this.whichAnchor = queryData.anchor || 1;
    if(!this.imgMap){
      this.renderAfter = true;
      this.loadImageSource();
    }
    if (!this.pen) {
      this.pen = wx.createCanvasContext("canvas", this);
      this.pen.setTextBaseline('middle');
      const device = getDevice();
      // 默认设置苹果6的高度
      this.canvasHeight = device.windowHeight == "unknown" ? 667 * 2 : device.windowHeight * 2;
      this.canvasWidth = device.windowWidth == 'unknown' ? 375 * 2 : device.windowWidth * 2;
      this.rate = this.canvasWidth/750;
      this.touchManager = new TouchManager();
      this.canvasEngine = new CanvasEngine(this.pen);
      this.touchManager.on('touchstart', _=>this.onTouchStart(_))
      this.touchManager.on("touchmove", _ => this.onTouchMove(_));
      this.touchManager.on("touchend", _ => this.onTouchEnd(_));
      this.touchManager.on("click", _ => this.onClick(_));
      this.touchManager.on('touchcancel', _=>this.onTouchCancel(_))
    }
    if(this.imgMap){
      this.drawInitFirstScreen();
    }
  },
  created(){
    
  },
  onShow() {},
  onHide() {},
  onReady() {},
  onUnload() {
    this.pen = null;
  },
  onShareAppMessage: function(ops) {}
};
