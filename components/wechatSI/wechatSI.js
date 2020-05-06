// components/wechatSI.js
var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
const req_fn = require("../../utils/route");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    text: '',
    imagePath: req_fn.imagePath,
    active: false
  },

  /**
   * 组件的方法列表
   */
  methods: {


    // 手指移动
    handleRecordingMove(e) {

    },
    // 手指触摸 开始录音
    handleRecording(e) {
      manager.start({
        duration: 60000,
        lang: "zh_CN"
      })
    },

    // 结束录音 手指拿开和取消
    handleRecordingCancel() {
      manager.stop()
    },
    on_hidden() {
      this.triggerEvent('hidden');
    },
    setValue(val) {
      this.triggerEvent('setValue', val);
    },
    catchtap() {}
  },
  // 组件生命周期
  lifetimes: {
    // 在组件实例刚刚被创建时执行
    created() {
      let _this = this
      // 有新的识别内容返回，则会调用此事件
      manager.onRecognize = function (res) {
        // _this.setValue(res.result)
      }
      // 识别结束事件
      manager.onStop = function (res) {
        _this.setData({
          active: false
        })
        _this.setValue(res.result)
      }
      // 正常开始录音识别时会调用此事件
      manager.onStart = function (res) {
        if (res.msg === "Ok") {
          _this.setData({
            active: true
          })
        }
      }
      // 识别错误事件
      manager.onError = function (res) {
        _this.setData({
          active: false
        })
        console.error("error msg", res.msg)
      }
    },
    // 在组件实例进入页面节点树时执行
    attached() {},
    //在组件在视图层布局完成后执行
    ready() {

    },
  },
  // 组件所在页面的生命周期
  pageLifetimes: {
    show: function () {
      // 页面被展示
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})