// components/pushList/pushList.js
const WxParse = require('../../wxParse/wxParse');
const req_fn = require("../../utils/route");
const util = require("../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    initPage() {
      let that = this;
      let data = util.getLocal('pushData', data)
      this.setData({
        info: data
      })
      //console.log(data);
      WxParse.wxParse('article', 'html', data.content, that, 5);
      util.clearLocal('pushData')
    }
  },
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      this.initPage()
    },
    //在组件在视图层布局完成后执行
    ready() {},
    // 在组件实例被移动到节点树另一个位置时执行
    moved() {},
    // 在组件实例被从页面节点树移除时执行
    detached() {

    },
    // 每当组件方法抛出错误时执行
    error() {

    }
  },
})