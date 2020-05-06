// inbox//cooperationOrfinancing/cooperationOrfinancing.js
const req_fn = require('../../../utils/route')
const util = require('../../../utils/util')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
	data: {
		companyId: '',
		cardList: [], //需求名片
		swiperIndex: 0, //默认显示的卡片
		isAuth: false,
		isLogin: true,//默认登陆状态
		isEmpty: false, //判断是否还有数据,
		testText:"登陆"
	},

  /**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
	//console.log(options,options.shareItemId,util.getLocal('Login'),',options')
	if(options.shareItemId != undefined){//分享页面进来
		if(util.getLocal('Login') != false){//如果登陆，这走登陆正常流程
			wx.showLoading({
				title: '加载中'
			})
			if (options.companyId) {
				this.setData({
					companyId: options.companyId ? options.companyId : util.getLocal('companyInfo').id,
					swiperIndex: options.index
				})
			}
			let size = 10
			if (options.index >= 10) {
				size = +options.index + (10 - (options.index % 10))
			}
			// 获取名片列表
			this.hasAttestation().then((res) => {
				if(res == true){
					this.getList('', size)
				}else{
					this.getList('', 3)
				}
			})
		}else{//没有登陆则显示分享的单独卡片信息
			this.setData({
				isLogin: false
			})
			this.getShareItemDetail(options.shareItemId);
		}
	}else{//不是分享页面进来的
		if(util.getLocal('Login') == false){//未登录
			this.setData({
				isLogin: false
			})
		}else{//登陆
			this.setData({
				isLogin: true
			})
			if (options.companyId) {
				this.setData({
					companyId: options.companyId ? options.companyId : util.getLocal('companyInfo').id,
					swiperIndex: options.index
				})
			}
			wx.showLoading({
				title: '加载中'
			})
			let size = 10
			if (options.index >= 10) {
				size = +options.index + (10 - (options.index % 10))
			}
			// 获取名片列表
			this.hasAttestation().then((res) => {
				if(res == true){
					this.getList('', size)
				}else{
					this.getList('', 3)
				}
			})
		}
		// //console.log(this.data.isLogin,'after')
	}
},

  /**
   * 用户点击右上角分享
   */
  	onShareAppMessage: function (e) {
		if (e.from === 'button') {
			// 来自页面内转发按钮  分享当前卡片
			let shareItemId = e.target.dataset.id;
			return {
				title: '需求名片详情',
				path:'/pages/email/cooperationOrfinancing/cooperationOrfinancing?companyId=' + this.data.companyId + '&index=' + this.data.swiperIndex + '&shareItemId=' + shareItemId
			}
		}else{//分享小程序
			return {
				title: '收件箱',
				path:'/pages/home/email/email',
				imageUrl:'./../../../static/images/share.png'
			}
		}
	},
	// 未登录事，获取分享单独详情
	getShareItemDetail(id){
		req_fn.req('/public/user/sendbox/' + id, {}, 'post').then(res => {
			if (res.data.sendUserAvatar.indexOf('http') == -1) {
				res.data.sendUserAvatar = req_fn.imgUrl + res.data.sendUserAvatar
			}
			if (typeof res.data.keywords == 'string'){
				res.data.keywords = res.data.keywords.split(',')
			}else{
				res.data.keywords = ['暂无']
			}
			this.setData({
				cardList:[res.data]
			})
		})
	},
	
	// 转发
	forward(e, actionType = 'forward') {
		let data = {
			actionType: actionType,
			platform: 'weixin'
		}
    	req_fn.req('api/company/mailbox/' + e.detail,data,'post').then(res => {
			if (res.code == 0) {
				// wx.showToast({
				//   title: "转发成功",
				//   icon: "success",
				//   durtion: 2000
				// });
			} else {
				wx.showToast({
					title: res.msg,
					icon: 'none',
					durtion: 2000
				})
			}
    	})
  	},
  	// 滑块的 index 发生改变
	changeSwiperIndex(e) {
		let index = e.detail
		// this.infoRead(this.data.cardList[index].id)
		if (!this.data.isLogin || this.data.isEmpty) return
		if (index % 10 > 7) {
			let finallyIndex = this.data.cardList.length - 1
			this.getList(this.data.cardList[finallyIndex].createTime)
		}
	},
	// 格式化列表数据
	changeKeyword(arr) {
		arr.forEach((element, i) => {
			if (typeof arr[i].keywords == 'string'){
				arr[i].keywords = element.keywords.split(',')
			}
			if (arr[i].sendUserAvatar.indexOf('http') == -1) {
				arr[i].sendUserAvatar = req_fn.imgUrl + arr[i].sendUserAvatar
			}
			// 附件
			if (arr[i].attachment != null) {
				let attachment = arr[i].attachment
				attachment.measurement = util.fileSize(attachment.size)
				attachment.time = util.formatTime(attachment.createTime, true)
				attachment.suffixName = util.suffixName(attachment.attachmentName)
			}
		})
		return arr
	},
	//  获取时间点之前或之后的数据，之前：before、之后：after （默认before,由新到旧）
	getList(lastTime = '', size = 10, timeDirection = 'before') {
		let url = 'public/company/' + this.data.companyId + '/mailboxes'
		if (this.data.isLogin) {
			url = 'api/company/' + this.data.companyId + '/mailboxes'
		}
		let data = {
			timeDirection: timeDirection,
			lastTime: lastTime,
			size: size
		}
		req_fn.req( url, data,'post').then(res => {
				if (res.code == 0) {
					//console.log(res,'list')
					this.changeKeyword(res.data)
					let cardList = this.data.cardList
					if (timeDirection == 'after') {
						//上一页
						res.data.reverse()
						cardList = [...res.data, ...cardList]
					} else {
						// 下一页
						if (size == 3) {
						cardList = []
						}
						cardList = [...cardList, ...res.data]
					}
					this.setData({
						cardList: cardList,
						isEmpty: res.data.length % 10 != 0
					})
				}
				if (!lastTime) {
					// this.infoRead(this.data.cardList[this.data.swiperIndex].id) //点查看详情
				}
				wx.hideLoading()
		})
	},
	// 已读
	infoRead(id) {
		// api/user/sendbox/{id} 获取别人的某个投递的详情，需求名片的id，cardList[0].id
		// if (this.data.isLogin) {
		// 	req_fn.req('api/user/sendbox/' + id + '/view-log', {}, 'post').then(res => {
		// 		//console.log('read: ', res)
		// 	})
		// }
	},
	// 发消息
	send(e) {
		if(!this.data.isLogin){
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
		}else{
			let sendUserId = e.detail.userId
			let id = e.detail.id
			if (this.data.isLogin) {
				if (sendUserId == util.getLocal('Login').im.easemobUserId) {
					wx.showToast({
						title: '暂未开放和自己聊天',
						icon: 'none',
						duration: 1500
					})
				} else {
					this.forward({
						detail: id
					},
					'talk'
					)
					// 聊天
					wx.navigateTo({
						url: '/pages/im/chat/chat?id=' + sendUserId + '&index=' + this.data.index
					})
				}
			} else {
			// 登录弹框
				util.modalIsLogin()
			}
		}
  	},
  	// 是否认证
	hasAttestation() {
		return new Promise((resolve, reject) => {
			req_fn.req('api/user/card/authed', {}, 'post').then(data => {
				let isAuth = false
				if (data.code == 0) {
					isAuth = data.data
					resolve(data.data)
				} else {
					wx.showToast({
						title: data.msg,
						icon: 'none',
						duration: 1500
					})
					reject(data.msg)
				}
				this.setData({
					isAuth: isAuth
				})
			})
		})
	}
})