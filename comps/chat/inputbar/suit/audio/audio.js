let WebIM = require("../../../../../utils/WebIM")["default"];
let msgType = require("../../../msgtype");
let RECORD_CONST = require("record_status");
let RecordStatus = RECORD_CONST.RecordStatus;
let RecordDesc = RECORD_CONST.RecordDesc;
// let disp = require("../../../../../utils/broadcast");
let RunAnimation = false
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
		chatType: {
			type: String,
			value: msgType.chatType.SINGLE_CHAT,
		},
		isKwyboard: {
			type: Boolean,
			value: false
		}
	},
	data: {
		text: "按住说话",
		changedTouches: null,
		recordStatus: RecordStatus.HIDE,
		RecordStatus,
		RecordDesc, // 模板中有引用
		recorderManager: wx.getRecorderManager(),
		recordClicked: false
	},
	methods: {
		toggleWithoutAction(e) {
			// 阻止 tap 冒泡
		},
		// 手指移动
		handleRecordingMove(e) {
			//console.log('手指移动');
			var touches = e.touches[0];
			var changedTouches = this.data.changedTouches;
			if (!changedTouches) {
				return;
			}

			if (this.data.recordStatus == RecordStatus.SWIPE) {
				if (changedTouches.pageY - touches.pageY < 20) {
					this.setData({
						recordStatus: RecordStatus.HOLD,
						text: "松开发送"
					});
					this.triggerEvent(
						"recordingstatus", 1
					);
				}

			}
			if (this.data.recordStatus == RecordStatus.HOLD) {
				if (changedTouches.pageY - touches.pageY > 20) {
					this.setData({
						recordStatus: RecordStatus.SWIPE,
						text: "按住说话"
					});
					this.triggerEvent(
						"recordingstatus", 2
					);
				}
			}
		},
		// 手指触摸 开始录音
		handleRecording(e) {
			let me = this;
			me.setData({
				recordClicked: true
			})
			executeRecord()
			// setTimeout(() => {
			// 	if (me.data.recordClicked == true) {
			// 		executeRecord()
			// 	}
			// }, 250)

			// 获取授权信息判断授权
			function executeRecord() {
				wx.getSetting({
					success: (res) => {
						let recordAuth = res.authSetting['scope.record']
						if (recordAuth == false) { //已申请过授权，但是用户拒绝

							wx.showModal({
								title: '提示',
								content: '去开启语音授权',
								success(res) {
									if (res.confirm) {
										wx.openSetting({
											success: function (res) {
												let recordAuth = res.authSetting['scope.record']
												if (recordAuth == true) {
													wx.showToast({
														title: "授权成功",
														icon: "success"
													})
												} else {
													wx.showToast({
														title: "请授权录音",
														icon: "none"
													})
												}
												me.setData({
													isLongPress: false
												})
											},
											fail(err) {
												//console.log(err);
											}
										})
									} else if (res.cancel) {
										//console.log('用户点击取消')
									}
								}
							})

						} else if (recordAuth == true) { // 用户已经同意授权

							setTimeout(() => {
								if (me.data.recordClicked == true) {
									startRecord()
								} else {
									me.handleRecordingCancel();
								}
							}, 250)

						} else { // 第一次进来，未发起授权
							wx.authorize({
								scope: 'scope.record',
								success: () => { //授权成功
									wx.showToast({
										title: "授权成功",
										icon: "success"
									})
								}
							})
						}
					},
					fail: function () {
						wx.showToast({
							title: "鉴权失败，请重试",
							icon: "none"
						})
					}
				})
			}

			// 开始录音
			function startRecord() {

				me.data.changedTouches = e.touches[0];
				me.setData({
					recordStatus: RecordStatus.HOLD
				});
				RunAnimation = true;

				let recorderManager = me.data.recorderManager || wx.getRecorderManager();
				recorderManager.onStart(() => {
					//console.log("监听录音开始事件");
					me.triggerEvent(
						"recordingstatus", 1
					);
					me.setData({
						text: "松开发送"
					})
					if (!RunAnimation) {
						me.handleRecordingCancel();
					}
				});
				recorderManager.start({
					format: "mp3"
				});
				// 超时
				setTimeout(function () {
					me.handleRecordingCancel();
					RunAnimation = false
				}, 100000);
			}
		},

		// 结束录音 手指拿开和取消
		handleRecordingCancel() {
			//console.log('手指拿开和取消');
			this.triggerEvent(
				"recordingstatus", 0
			);

			RunAnimation = false

			let recorderManager = this.data.recorderManager;
			// 向上滑动状态停止：取消录音发放
			if (this.data.recordStatus == RecordStatus.SWIPE) {
				this.setData({
					recordStatus: RecordStatus.RELEASE,
					text: "按住说话"
				});
			} else {
				this.setData({
					recordStatus: RecordStatus.HIDE,
					recordClicked: false,
					text: "按住说话"
				});
			}

			recorderManager.onStop((res) => {
				this.triggerEvent(
					"recordingstatus", 0
				);
				if (this.data.recordStatus == RecordStatus.RELEASE) {
					this.setData({
						recordStatus: RecordStatus.HIDE
					});
					return;
				}
				if (res.duration < 1000) {
					wx.showToast({
						title: "录音时间太短",
						icon: "none"
					})
				} else {
					// 上传
					this.uploadRecord(res.tempFilePath, res.duration);
				}
			});
			// 停止录音
			recorderManager.stop();
		},

		isGroupChat() {
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam() {
			// return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
			return this.properties.userId
		},

		uploadRecord(tempFilePath, dur) {
			var str = WebIM.config.appkey.split("#");
			var me = this;
			var token = WebIM.conn.context.accessToken
			wx.uploadFile({
				url: "https://a1.easemob.com/" + str[0] + "/" + str[1] + "/chatfiles",
				filePath: tempFilePath,
				name: "file",
				header: {
					"Content-Type": "multipart/form-data",
					Authorization: "Bearer " + token
				},
				success(res) {
					// 发送 xmpp 消息
					var id = WebIM.conn.getUniqueId();
					var msg = new WebIM.message(msgType.AUDIO, id);
					var dataObj = JSON.parse(res.data);
					// 接收消息对象
					msg.set({
						apiUrl: WebIM.config.apiURL,
						accessToken: token,
						body: {
							type: msgType.AUDIO,
							url: dataObj.uri + "/" + dataObj.entities[0].uuid,
							filetype: "",
							filename: tempFilePath,
							accessToken: token,
							length: Math.ceil(dur / 1000)
						},
						from: WebIM.userIm.easemobUserId,
						to: me.getSendToParam(),
						roomType: false,
						chatType: me.data.chatType,
						success: function (argument) {
							let msgBody = msg.body
							let magObj = {
								id: msgBody.id,
								to: msgBody.to,
								from: WebIM.userIm.easemobUserId,
								data: msgBody.body.url,
								url: msgBody.body.url,
								type: msgBody.type,
								filename: msgBody.body.filename,
								accessToken: msgBody.body.accessToken,
								length: msgBody.body.length
							};


							WebIM.saveMsg(magObj, msgBody.type, true).then(res => {
								me.triggerEvent("refresh");
							});
						}
					});
					if (me.isGroupChat()) {
						msg.setGroup("groupchat");
					}
					msg.body.length = Math.ceil(dur / 1000);
					WebIM.conn.send(msg.body);
				}
			});
		},
	},

	// lifetimes
	created() {},
	attached() {},
	moved() {},
	detached() {},
	ready() {},
});