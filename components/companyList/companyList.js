// components/companyList/companyList.js
const req_fn = require("../../utils/route");
const util = require("../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lists: {
      type: Array,
    },
    iconCollect: {
      type: Boolean,
      value: false, //默认值
    },
    iconSend: {
      type: Boolean,
      value: false,
    },
    recommend: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    flag: true,
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 
    var myEventDetail = {} // detail对象，提供给事件监听函数
    var myEventOption = {// 触发事件的选项
    bubbles: false, //事件是否冒泡
    capturePhase: false //事件是否拥有捕获阶段
    } 
    this.triggerEvent('myevent', myEventDetail, myEventOption)
    */

    titleImgErr(e) {
      let index = e.target.dataset.index
      this.triggerEvent('titleImgErr', {
        index: index
      });
    },
    // 点击列表事件
    onListEvent(e) {


      if (this.data.flag) {
        let index = e.currentTarget.dataset.index
        this.triggerEvent('onListEvent', {
          index: index
        });
      }
      this.data.flag = false
      setTimeout(() => {
        this.data.flag = true
      }, 300);

    },
    // 点击收藏icon事件
    onIconCollectEvent(e) {

      if (this.data.flag) {
        let index = e.currentTarget.dataset.index
        this.triggerEvent('onIconCollectEvent', {
          index: index
        });
      }
      this.data.flag = false
      setTimeout(() => {
        this.data.flag = true
      }, 300);


    },
    // 点击投递icon事件
    onIconSendEvent(e) {
      if (this.data.flag) {
        let index = e.currentTarget.dataset.index
        this.triggerEvent('showModal', {
          index: index
        });
      }
      this.data.flag = false
      setTimeout(() => {
        this.data.flag = true
      }, 300);

    },
    onRecommendChecked(e) {
      let index = e.currentTarget.dataset.index
      this.triggerEvent('onRecommendChecked', {
        index: index
      });
    }
  },
  // 组件生命周期
  lifetimes: {
    // 在组件实例刚刚被创建时执行
    created() {},
    // 在组件实例进入页面节点树时执行
    attached() {
      // this.setData({
      //   hospDeptNameOne: this.properties.hospDeptNameOne,
      // })
    },
    //在组件在视图层布局完成后执行
    ready() {

    },
    // 在组件实例被移动到节点树另一个位置时执行
    moved() {},
    // 在组件实例被从页面节点树移除时执行
    detached() {

    },
    // 每当组件方法抛出错误时执行
    error() {

    }
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