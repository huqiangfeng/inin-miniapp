const util = require("../../../utils/util");
const req_fn = require("../../../utils/route");
const amapFile = require('./../../../utils/amap-wx'); //引入高德js
let toolTimeout = null;
let Index = -20;
let curMsgMid = ''
let isFail = false
const app = getApp();

let pageY, pageX;
let isPass = true;
Component({
	properties: {
		// username: {
		// 	type: Object,
		// 	value: {},
		// },
		userId: {
			type: String,
			value: {},
		},
	},
	data: {
		localImg: app.localImg,
		toView: "",
		myAvatar: "", // 我的头像
		chatMsg: [],
		cardInfo: {}, // 对方信息
		__visibility__: false,
		toolCabinetIsShow: false,
		isToolTop: false,
		emojiCode: {
			"ee_1.png": "[):]",
			"ee_2.png": "[:D]",
			"ee_3.png": "[;)]",
			"ee_4.png": "[:-o]",
			"ee_5.png": "[:p]",
			"ee_6.png": "[(H)]",
			"ee_7.png": "[:@]",
			"ee_8.png": "[:s]",
			"ee_9.png": "[:$]",
			"ee_10.png": "[:(]",
			"ee_11.png": "[:'(]",
			"ee_12.png": "[<o)]",
			"ee_13.png": "[(a)]",
			"ee_14.png": "[8o|]",
			"ee_15.png": "[8-|]",
			"ee_16.png": "[+o(]",
			"ee_17.png": "[|-)]",
			"ee_18.png": "[:|]",
			"ee_19.png": "[*-)]",
			"ee_20.png": "[:-#]",
			"ee_21.png": "[^o)]",
			"ee_22.png": "[:-*]",
			"ee_23.png": "[8-)]",
			"btn_del.png": "[del]",
			"ee_24.png": "[(|)]",
			"ee_25.png": "[(u)]",
			"ee_26.png": "[(S)]",
			"ee_27.png": "[(*)]",
			"ee_28.png": "[(#)]",
			"ee_29.png": "[(R)]",
			"ee_30.png": "[({)]",
			"ee_31.png": "[(})]",
			"ee_32.png": "[(k)]",
			"ee_33.png": "[(F)]",
			"ee_34.png": "[(W)]",
			"ee_35.png": "[(D)]",
		}
	},
	methods: {
		on_again(e) {
			let ext = e.currentTarget.dataset.ext
			console.log(ext);
			let companyName, companyID, logo, userName;
			companyName = ext.companyName;
			companyID = ext.companyId;
			logo = ext.companyLogo;
			wx.navigateTo({
				url: '/pages/email/visitHome/visitHome?companyName=' + companyName + '&companyID=' + companyID + '&logo=' + logo
			})
		},
		// 跳去地图
		to_map(e) {
			let ext = e.currentTarget.dataset.ext
			wx.navigateTo({
				url: '/pages/im/map/map?contactAddressLocation=' + ext.contactAddressLocation
			})
		},
		// 点击查看图片
		previewImage(event) {
			var url = event.target.dataset.url;
			wx.previewImage({
				urls: [url] // 需要预览的图片 http 链接列表
			});
		},
		// 更新数据
		refresh() {
			wx.showNavigationBarLoading();
			this.renderMsg(true)
			wx.hideNavigationBarLoading();
		},
		// 渲染聊天数据
		renderMsg(record, isFirst) {
			//console.log(util.getLocal("msgList"),'渲染聊天数据')
			//console.log(this.properties.userId,'_this.properties.userId')
			let _this = this
			let chatList = [];
			let data = util.getLocal("msgList");
			for (let i = 0; i < data.length; i++) {
				if (data[i].listid == _this.properties.userId) {
					chatList = data[i].data;
					data[i].unread = 0;
					break
				}
			}
			//console.log(!chatList.length,chatList,'!chatList.length')
			if (!chatList.length) return;
			// 判断是否刷新获取历史
			if (record) {
				Index -= 20
				_this.setData({
					chatMsg: this.setListDate(chatList.slice(Index)),
				});
			} else {
				if (data instanceof Array) {
					util.setLocal("msgList", data)
				}

				_this.setData({
					chatMsg: this.setListDate(chatList.slice(Index)),
					// 跳到最后一条
					toView: chatList[chatList.length - 1].mid,
				});
				--Index
				if (isFirst) {
					setTimeout(() => {
						this.scrollBottom()
					}, 200);
				}
				// 发送失败
				if (isFail) {
					_this.renderFail()
				}
			}
			//console.log(this.data.chatMsg,'this.data.chatMsg')
		},
		// 设置时间格式化
		setListDate(list) {
			let newDate = new Date().getTime()
			for (let i = 0; i < list.length; i++) {
				let abc = newDate - list[i].time
				if (i > 0 && abc < 60000) {
					list[i].date = false
				} else {
					list[i].date = util.getDate(list[i].time);
				}
				list[i].isToolShow = false
				if (list[i].type === 'admin' && !list[i].ext.map) {
					let endDate = util.formatTime(list[i].ext.deliverEndTime, true, true)
					let startDate = util.formatTime(list[i].ext.deliverStartTime, true, true)
					let week = new Date(list[i].ext.deliverStartTime).getDay()
					if (week === 0) {
						week = ' 周末 '
					} else if (week === 1) {
						week = ' 周一 '
					} else if (week === 2) {
						week = ' 周二 '
					} else if (week === 3) {
						week = ' 周三 '
					} else if (week === 4) {
						week = ' 周四 '
					} else if (week === 5) {
						week = ' 周五 '
					} else if (week === 6) {
						week = ' 周六 '
					}
					startDate = startDate.split(" ")
					endDate = endDate.split(" ")
					list[i].ext.date = startDate[0] + week + startDate[1] + '-' +
						endDate[1]
					var key = 'd99cf7c21d908110e1fafd498db355fe'
					var myAmapFun = new amapFile.AMapWX({
						key: key
					});
					var height = 120;
					var width = 448;
					var size = width + "*" + height;
					let _this = this
					console.log('contactAddressLocation', list[i].ext.contactAddressLocation);
					myAmapFun.getStaticmap({
						zoom: 14,
						size: size,
						scale: 1,
						location: list[i].ext.contactAddressLocation,
						markers: `small,0xFF0000,A:${ list[i].ext.contactAddressLocation }`,
						success: function (data) {
							list[i].ext.map = data.url
							_this.setData({
								chatMsg: list
							})
							console.log('list', list);
						}
					})
				}
			}
			return list
		},
		// 发送失败
		renderFail() {
			let me = this
			let msgList = me.data.chatMsg
			msgList.map((item) => {
				if (item.id == myid) {
					item.msg.data[0].isFail = true
					item.isFail = true

					me.setData({
						chatMsg: msgList
					})
				}
			})
			if (me.curChatMsg[0].mid == curMsgMid) {
				me.curChatMsg[0].msg.data[0].isShow = false;
				me.curChatMsg[0].isShow = false
			}
			isFail = false
		},
		// 获取用户的简略信息
		getUserInfo(id = "") {
			if (id === 'admin') {
				wx.setNavigationBarTitle({
					title: '小传'
				});
				this.setData({
					cardInfo: {
						avatar: 'https://wx.onechuan.com/api_test/images/wx/send_blue.png',
						name: '小传',
						friendStatus: '',
						companyName: '',
						positionName: '',
					}
				})
				return
			}
			req_fn
				.req("api/user/" + id + "/simple-info", {}, "post")
				.then(res => {
					if (res.code == 0) {
						// 设置标题
						wx.setNavigationBarTitle({
							title: res.data.name != null ? res.data.name : ""
						});
						if (res.data.avatar != null) {
							if (res.data.avatar.indexOf("http") == -1) {
								res.data.avatar = req_fn.imgUrl + res.data.avatar;
							} else {
								res.data.avatar += "?width=50";
							}
						} else {
							res.data.avatar = '../../../static/images/mine/my_friend.png'
						}
						setTimeout(() => {
							wx.hideLoading();
						}, 300);
						this.setData({
							cardInfo: res.data
						})
						//console.log(this.data.cardInfo,'res.data.avatar')
					}
				});
		},
		// 点击添加好友 friend,applying,null
		addFriend(e) {
			req_fn
				.req("api/user/friend-apply", {
					friendUserId: this.data.cardInfo.userId
				}, "post")
				.then(res => {
					if (res.code == 0) {
						this.setData({
							'cardInfo.friendStatus': "applying",
							// canScroll: false  是否可以 滚动 ？？？
						})
					} else {
						wx.showToast({
							title: res.msg,
							icon: "none",
							duration: 2000
						});
					}
				});
		},
		// 得到头像
		getuserLogo() {
			req_fn.req("api/user", {}, "post").then(res => {
				if (res.code == 0) {
					if (res.data.avatar.indexOf("http") == -1)
						this.setData({
							myAvatar: req_fn.imgUrl + res.data.avatar + "?width=50"
						})
					else this.setData({
						myAvatar: res.data.avatar + "?width=50"
					})
				}
			});
		},
		// 滑到最下面
		scrollBottom() {
			this.setData({
				toView: this.data.chatMsg[this.data.chatMsg.length - 1].mid,
			});
		},

		// 关闭Tool
		close() {
			let chatMsg = this.data.chatMsg
			for (var i = 0; i < chatMsg.length; i++) {
				chatMsg[i].isToolShow = false
			}
			this.setData({
				chatMsg: chatMsg
			})
		},

		// 开启工具箱准备
		handleStart(e) {
			clearTimeout(toolTimeout)
			isPass = true;
			pageY = e.touches[0].pageY
			pageX = e.touches[0].pageX
			toolTimeout = setTimeout(() => {
				let chatMsg = this.data.chatMsg
				chatMsg[e.currentTarget.dataset.index].isToolShow = true
				this.setData({
					isToolTop: e.touches[0].pageY > 170,
					chatMsg: chatMsg
				})
				isPass = false;
			}, 800);
			this.close()
		},

		// 开启工具箱准备
		handleMove(e) {
			if (Math.abs(pageY - e.touches[0].pageY) > 30 || Math.abs(pageX - e.touches[0].pageX) > 30) {
				isPass = false;
				clearTimeout(toolTimeout)
			}
		},
		// 开启工具箱准备
		handleCancel(e) {
			let index = e.currentTarget.dataset.index
			let type = e.currentTarget.dataset.type
			clearTimeout(toolTimeout)
			if (isPass) {
				if (type === 'audio') {
					this.selectComponent('#audio' + index).audioPlay()
				} else if (type === 'img') {
					this.previewImage(e)
				}
			}
			isPass = true;
		},
		// 复制
		copy(e) {

			let index = e.currentTarget.dataset.index;
			let type = e.currentTarget.dataset.type;
			let copyData = '';
			let dataTxt = this.data.chatMsg[index].text
			if (type === 'txt') {
				copyData = dataTxt
			} else if (type === 'emoji') {
				dataTxt.forEach(item => {
					if (item.type === 'txt') {
						copyData = copyData + item.data
					} else if (item.type === 'emoji') {
						// this.data.emojiCode[]
						copyData = copyData + this.data.emojiCode[item.data]
					}
				});
			}
			//console.log(dataTxt);

			wx.setClipboardData({
				data: copyData,
				success(res) {
					wx.getClipboardData({
						success(res) {
							//console.log(res.data) // data
						}
					})
				}
			})
		},
		//删除
		del(e) {

			let index = e.currentTarget.dataset.index

			let _this = this
			let data = util.getLocal("msgList");
			for (let i = 0; i < data.length; i++) {
				if (data[i].listid == _this.properties.userId) {
					data[i].data.splice(index, 1)
					util.setLocal('msgList', data)
					break
				}
			}

			let chatMsg = this.data.chatMsg
			chatMsg.splice(index, 1)
			this.setData({
				chatMsg: chatMsg
			})

		},
		toChat(e) {
			//console.log(e.currentTarget.dataset.id);
			let id = e.currentTarget.dataset.id
			wx.redirectTo({
				url: "/pages/im/chat/chat?id=" + id
			})
		}
	},

	// lifetimes
	created() {},
	attached() {
		this.__visibility__ = true;
		Index = -20;
	},
	moved() {},
	detached() {
		this.__visibility__ = false;
	},
	ready(event) {
		// 获取用户的简略信息
		this.getUserInfo(this.properties.userId)

		// 得到头像
		this.getuserLogo()
		// 注册全局方法，接收消息
		app.onMessage = e => {
			setTimeout(() => {
				this.renderMsg();
			}, 100);
		};
		// 获取聊天记录
		this.renderMsg(false, true);
		// disp.on('em.xmpp.error.sendMsgErr', function (err) {
		// 	curMsgMid = err.data.mid
		// 	isFail = true
		// 	return
		// });
	},
});