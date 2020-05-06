// pages/email/visitPersonInfo/visitPersonInfo.js
const util = require('../../../utils/util')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
    visitList:[],
    testArr:[1,1,1,1,1,1,1,1,1],
		currentIndex:0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let arr = wx.getStorageSync('visitList');
		arr.map(item => {
				return item.appointment = util.formatTime(item.deliverStartTime,true,true)
		})
		this.setData({visitList:arr,currentIndex:Number(options.currentIndex)})
	},
	bindchange(e){
		this.setData({currentIndex:e.detail.current})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  sendMessage(){
	let chatId = this.data.visitList[this.data.currentIndex].sendUserId;
	let mySelfUserID = util.getLocal('card').userId;
	if(chatId == mySelfUserID){
		wx.showToast({
			title:'不可以和自己聊天',
			icon:'none',
			duration:1200
		})
	}else{
		wx.navigateTo({
			url:'/pages/im/chat/chat?id=' + chatId
		})
	}
  },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})