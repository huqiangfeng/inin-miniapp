let RecordStatus = require("suit/audio/record_status").RecordStatus;
let msgType = require("../msgtype");

Component({
	properties: {
		userId: {
			type: String,
			value: {},
		},
		chatType: {
			type: String,
			value: msgType.chatType.SINGLE_CHAT,
		},
	},
	data: {
		recordStatus: RecordStatus.HIDE,
		RecordStatus,
		isKwyboard: true, // 键盘状态or语音状态
		chatValue: '', // 
		isMenu: true, // 菜单隐藏
		__comps__: {
			main: null,
			emoji: null,
			image: null,
			location: null,
			//video: null,
		},
	},
	methods: {
		// 事件有长度限制：仅限 26 字符
		// 显示语音
		toggleRecordModal() {
			// 关闭键盘
			wx.hideKeyboard()
			this.switchIsKwyboard()
		},
		// 切换语音和打字
		switchIsKwyboard() {
			this.setData({
				isKwyboard: !this.data.isKwyboard
			})
		},
		// 发送视频文件
		sendVideo() {
			this.data.__comps__.video.sendVideo();
		},
		// 拍照
		openCamera() {
			this.data.__comps__.image.openCamera();
		},
		// 打开表情菜单
		openEmoji() {
			// 关闭键盘
			wx.hideKeyboard()
			this.setData({
				isMenu: true
			})
			this.data.__comps__.emoji.openEmoji();

			this.triggerEvent("liststart", 2);
		},

		// 关闭表情菜单
		cancelEmoji() {
			this.setData({
				isMenu: true
			})
			// this.triggerEvent("liststart", 0);
			this.data.__comps__.emoji.cancelEmoji();
		},

		// 相册
		sendImage() {
			this.data.__comps__.image.sendImage();
		},
		// 发送定位
		sendLocation() {
			this.data.__comps__.location.sendLocation();
		},
		// 表情回调-- 选中
		emojiAction(evt) {
			//console.log(evt);

			this.data.__comps__.main.emojiAction(evt.detail);
		},
		// 点击按钮发送消息
		sendMsg() {
			this.data.__comps__.main.sendMessage();
		},
		// 发送完成更新聊天数据
		refresh() {
			this.triggerEvent("refresh");
		},
		// 显示菜单
		showMenu() {
			// 关闭键盘
			wx.hideKeyboard()

			this.data.__comps__.emoji.cancelEmoji();
			setTimeout(() => {
				this.setData({
					isMenu: false
				})
			}, 100);

			this.triggerEvent("liststart", 2);
		},
		// 输入框input事件
		oninput(e) {
			this.setData({
				chatValue: e.detail
			})
		},
		// 语音状态
		recordingstatus(e) {
			this.triggerEvent("recordingstatus", e.detail);
		},
		// 显示发送个人名片
		showManKeep() {
			this.triggerEvent("showManKeep");
		}
	},

	// lifetimes
	created() {},
	attached() {},
	moved() {},
	detached() {},
	ready() {
		let comps = this.data.__comps__;
		comps.main = this.selectComponent("#chat-suit-main");
		comps.emoji = this.selectComponent("#chat-suit-emoji");
		comps.image = this.selectComponent("#chat-suit-image");
		// comps.location = this.selectComponent("#chat-suit-location");
		// comps.video = this.selectComponent("#chat-suit-video");



		wx.offWindowResize(function (e) {
			//console.log(e);

		})
	},
});