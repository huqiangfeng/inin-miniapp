// components/companyList/companyList.js
const req_fn = require("../../utils/route");
const util = require("../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    peopleData: {
      type: Object,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    loadingShow: {
      type: Boolean,
      value: false,
    },
    isAuth: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    login: false,
    imagePath: req_fn.imagePath,
    localImg: app.localImg,
    screenHeight: 800,
    elementHeight: 400,
  },

  /**
   * 组件的方法列表
   */
  methods: {

    _collect() {
      // @repair 接口
      //   this.$emit("send", e);
    },
    _tapItem(e) {
      this.triggerEvent('tapItem', {
        index: e.currentTarget.dataset.index
      });
    },
    // 去认证
    _attestation() {
      this.triggerEvent('attestation');
    },
    upper(e) {
      //console.log(11);

      // 滚动到上面触发
    },
    lower(e) {
      //console.log(22);
      // 滚动到下面触发
    },
    localImg() {
      return this.$localImg;
    },
    // 去登录
    _toLogin() {
      this.triggerEvent('toLogin');
    },
    // 去认证
    _toAttestation() {
      this.triggerEvent('toAttestation');
    }
  },
  // 组件生命周期
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      // this.setData({
      //   hospDeptNameOne: this.properties.hospDeptNameOne,
      // })
      this.setData({
        login: !!util.isLogin()
      })
      // wx.getSystemInfo({
      //   success: res => {
      //     this.data.screenHeight = res.windowHeight + 270;
      //     this.data.elementHeight = res.windowHeight / 2;
      //   }
      // });
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
})