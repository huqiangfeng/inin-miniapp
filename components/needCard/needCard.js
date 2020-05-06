// components/companyList/companyList.js
const req_fn = require("../../utils/route");
const util = require("../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
	properties: {
		isSwiper: { //是否左右滑动
			type: Boolean,
			value: false
		},
		swiperIndex: { //当前显示的是第几页
			type: Number,
			value: 0,
		},
		cardList: { //名片列表
			type: Array,
			value: [],
		},
		delta: {
			type: Number,
			value: 1
		},
		loginFlag:Boolean,
	},
  /**
   * 组件的初始数据
   */
	data: {
		localImg: app.localImg,
		imagePath: req_fn.imagePath,
	},
  /**
   * 组件的方法列表
   */
  methods: {
    // 滑块的 index 发生改变
    changeSwiperIndex(e) {
      let index = e.detail.current
      this.triggerEvent('changeSwiperIndex', index);
    },
    // 转发
    forward(e) {
		let id = e.currentTarget.dataset.id
		this.triggerEvent('forward', id);
    },
    // 未登录点击转发按钮
    noLoginForward(){
		wx.showToast({
			title: "请先登录",
			icon: "none",
			durtion: 2000
		});
		setTimeout(() => {
			wx.redirectTo({
				url: '/pages/home/login/login'
			})
		}, 2000);
    },
    // 查看附件
    viewAttachment(e) {
      let data = this.properties.cardList[e.currentTarget.dataset.index].attachment
     
      wx.navigateTo({
        url: "/pages/email/download/download?data=" + JSON.stringify(data)
      });
    },

    // 发消息
    send(e) {
      this.triggerEvent('send', {
        userId: e.currentTarget.dataset.userid,
        id: e.currentTarget.dataset.id
      });
    },
  },
})