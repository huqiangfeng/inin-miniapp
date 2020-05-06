let WebIM = require("../../../../../utils/WebIM")["default"];
let msgType = require("../../../msgtype");
// let disp = require("../../../../../utils/broadcast");
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
		inputMessage: "", // render input 的值
		userMessage: "", // input 的实时值
		type: 'txt'
	},

	methods: {
		focus() {
			this.triggerEvent("inputFocused", null, {
				bubbles: true
			});
		},

		blur() {
			this.triggerEvent("inputBlured", null, {
				bubbles: true
			});
		},

		isGroupChat() {
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam() {
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		// bindinput 不能打冒号！
		bindMessage(e) {
			this.setData({
				userMessage: e.detail.value
			});
			// 
			this.triggerEvent("oninput", e.detail.value);
		},

		emojiAction(emojiObj) {

			let emoji = emojiObj.msg
			var str;
			var msglen = this.data.userMessage.length - 1;
			if (emoji && emoji != "[del]") {
				str = this.data.userMessage + emoji;
				this.data.type = 'emoji'
			} else if (emoji == "[del]") {
				let start = this.data.userMessage.lastIndexOf("[");
				let end = this.data.userMessage.lastIndexOf("]");
				let len = end - start;
				if (end != -1 && end == msglen && len >= 3 && len <= 4) {
					str = this.data.userMessage.slice(0, start);
				} else {
					str = this.data.userMessage.slice(0, msglen);
				}
			}
			this.setData({
				userMessage: str,
				inputMessage: str,
			});
			this.triggerEvent("oninput", str);
		},

		sendMessage() {
			let _this = this
			// String.prototype.trim = function () {
			// 	return this.replace(/(^\s*)|(\s*$)/g, '');
			// }
			if (!this.data.userMessage.trim()) {
				return;
			}
			let id = WebIM.conn.getUniqueId();
			let msg = new WebIM.message(msgType.TEXT, id);
			let content = _this.data.userMessage;
			msg.set({
				msg: content, // 消息内容
				to: _this.properties.userId, // 接收消息对象（用户id） 
				// from: WebIM.userIm.easemobUserId,
				roomType: false,
				// chatType: _this.data.chatType,
				ext: {}, // 扩展消息
				success: (id, serverMsgId) => {
					let msg = {
						id: serverMsgId,
						to: _this.properties.userId,
						from: WebIM.userIm.easemobUserId,
						data: content
					};
					WebIM.saveMsg(msg, _this.data.type, true).then(res => {
						_this.triggerEvent("refresh");
						_this.triggerEvent("oninput", '');
						_this.data.type = 'txt'
					}).catch(err => {
						//console.log(err,'message error')
					});
				},
				fail: (e) => {
					_this.data.type = 'txt'
					wx.showToast({
						title: "发送失败，请稍后重试",
						icon: "none",
						duration: 2000
					});
				}
			});

			if (_this.data.chatType == msgType.chatType.CHAT_ROOM) {
				msg.setGroup("groupchat");
			}
			WebIM.conn.send(msg.body);

			_this.setData({
				userMessage: "",
				inputMessage: "",
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