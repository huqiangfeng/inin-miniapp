// import Strophe from "../sdk/libs/strophe";
//import xmldom from "../sdk/libs/xmldom/dom-parser";
import websdk from "../sdk/connection";
import config from "./WebIMConfig";
const req_fn = require("./route");
const util = require('./util');
console.group = console.group || {};
console.groupEnd = console.groupEnd || {};

const emojiDataInit = (text) => {
	let start = text.indexOf("["); // 从0开始
	let end = text.indexOf("]");
	let len = end - start;
	let isEmoji = len >= 3 && len <= 4
	let str, itemObj = new Object()

	if (start > 0 || !isEmoji || start < 0 || end < 0) {
		// 没有表情
		if (start < 0 || end < 0) {
			itemObj.type = "txt"
			itemObj.data = text
			return [itemObj]
			// 不是表情
		} else if (!isEmoji) {
			str = text.slice(0, end + 1);
			itemObj.type = "txt"
			itemObj.data = str
			let temp = text.slice(end + 1)
			if (temp)
				return [itemObj, ...emojiDataInit(temp)]
			else
				return [itemObj]
		} else
			str = text.slice(0, start);
		itemObj.type = "txt"
		itemObj.data = str
		let temp = text.slice(start)
		if (temp)
			return [itemObj, ...emojiDataInit(temp)]
		else
			return [itemObj]
	} else {
		//表情
		str = text.slice(start, end + 1);
		let data = WebIM.Emoji.map[str]
		if (data) {
			itemObj.type = "emoji"
			itemObj.data = data
		} else {
			itemObj.type = "txt"
			itemObj.data = str
		}
		let temp = text.slice(end + 1)
		if (temp)
			return [itemObj, ...emojiDataInit(temp)]
		else
			return [itemObj]
	}
}
var window = {};
let WebIM = window.WebIM = websdk;
window.WebIM.config = config;


WebIM.userIm = util.getLocal('Login').im


WebIM.parseEmoji = function (msg) {
	if (typeof WebIM.Emoji === "undefined" || typeof WebIM.Emoji.map === "undefined") {
		return msg;
	}
	var emoji = WebIM.Emoji,
		reg = null;
	var msgList = [];
	var objList = [];
	for (var face in emoji.map) {
		if (emoji.map.hasOwnProperty(face)) {
			while (msg.indexOf(face) > -1) {
				msg = msg.replace(face, "^" + emoji.map[face] + "^");
			}
		}
	}
	var ary = msg.split("^");
	var reg = /^e.*g$/;
	for (var i = 0; i < ary.length; i++) {
		if (ary[i] != "") {
			msgList.push(ary[i]);
		}
	}
	for (var i = 0; i < msgList.length; i++) {
		if (reg.test(msgList[i])) {
			var obj = {};
			obj.data = msgList[i];
			obj.type = "emoji";
			objList.push(obj);
		} else {
			var obj = {};
			obj.data = msgList[i];
			obj.type = "txt";
			objList.push(obj);
		}
	}
	return objList;
};

WebIM.Emoji = {
	path: "/static/images/faces/",
	map: {
		"[):]": "ee_1.png",
		"[:D]": "ee_2.png",
		"[;)]": "ee_3.png",
		"[:-o]": "ee_4.png",
		"[:p]": "ee_5.png",
		"[(H)]": "ee_6.png",
		"[:@]": "ee_7.png",
		"[:s]": "ee_8.png",
		"[:$]": "ee_9.png",
		"[:(]": "ee_10.png",
		"[:'(]": "ee_11.png",
		"[<o)]": "ee_12.png",
		"[(a)]": "ee_13.png",
		"[8o|]": "ee_14.png",
		"[8-|]": "ee_15.png",
		"[+o(]": "ee_16.png",
		"[|-)]": "ee_17.png",
		"[:|]": "ee_18.png",
		"[*-)]": "ee_19.png",
		"[:-#]": "ee_20.png",
		"[^o)]": "ee_21.png",
		"[:-*]": "ee_22.png",
		"[8-)]": "ee_23.png",
		"[del]": "btn_del.png",
		"[(|)]": "ee_24.png",
		"[(u)]": "ee_25.png",
		"[(S)]": "ee_26.png",
		"[(*)]": "ee_27.png",
		"[(#)]": "ee_28.png",
		"[(R)]": "ee_29.png",
		"[({)]": "ee_30.png",
		"[(})]": "ee_31.png",
		"[(k)]": "ee_32.png",
		"[(F)]": "ee_33.png",
		"[(W)]": "ee_34.png",
		"[(D)]": "ee_35.png"
	}
};

WebIM.EmojiObj = {
	// 相对 emoji.js 路径
	path: "/static/images/faces/",
	map1: {
		"[):]": "ee_1.png",
		"[:D]": "ee_2.png",
		"[;)]": "ee_3.png",
		"[:-o]": "ee_4.png",
		"[:p]": "ee_5.png",
		"[(H)]": "ee_6.png",
		"[:@]": "ee_7.png"
	},
	map2: {
		"[:s]": "ee_8.png",
		"[:$]": "ee_9.png",
		"[:(]": "ee_10.png",
		"[:'(]": "ee_11.png",
		"[<o)]": "ee_12.png",
		"[(a)]": "ee_13.png",
		"[8o|]": "ee_14.png"
	},
	map3: {
		"[8-|]": "ee_15.png",
		"[+o(]": "ee_16.png",
		"[|-)]": "ee_17.png",
		"[:|]": "ee_18.png",
		"[*-)]": "ee_19.png",
		"[:-#]": "ee_20.png",
		"[del]": "del.png"
	},
	map4: {
		"[^o)]": "ee_21.png",
		"[:-*]": "ee_22.png",
		"[8-)]": "ee_23.png",
		"[(|)]": "ee_24.png",
		"[(u)]": "ee_25.png",
		"[(S)]": "ee_26.png",
		"[(*)]": "ee_27.png"
	},
	map5: {
		"[(#)]": "ee_28.png",
		"[(R)]": "ee_29.png",
		"[({)]": "ee_30.png",
		"[(})]": "ee_31.png",
		"[(k)]": "ee_32.png",
		"[(F)]": "ee_33.png",
		"[(W)]": "ee_34.png"
	},
	map6: {
		"[(D)]": "ee_35.png",
		"[del]": "del.png"
	}
};

// wx.connectSocket({url: WebIM.config.xmppURL, method: "GET"})

WebIM.conn = new WebIM.connection({
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: WebIM.config.https,
	url: WebIM.config.xmppURL,
	apiUrl: WebIM.config.apiURL,
	isAutoLogin: false,
	heartBeatWait: WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
	delivery: WebIM.config.delivery
});

// 消息回执  发送消息
WebIM.ack = (receiveMsg) => {
	// 处理未读消息回执
	var bodyId = receiveMsg.id; // 需要发送已读回执的消息id
	var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
	ackMsg.set({
		id: bodyId,
		to: receiveMsg.from
	});
	WebIM.conn.send(ackMsg.body);
}
// send=true 发送的消息，send=false 接收的消息
WebIM.saveMsg = (msg, type = 'txt', send = false) => {
	console.log('msg', msg);
	// 判断是不是自己
	if (msg.from === WebIM.userIm.easemobUserId) {
		send = true
	}
	// 判断是不是管理
	if (msg.from === "admin") {
		type = msg.from
	}
	let data = wx.getStorageSync('msgList') != '' ? wx.getStorageSync('msgList') : [];
	let now = new Date().getTime();

	//console.log(type,'before txt')
	if (type === 'txt') {
		type = 'emoji'
	}
	try {
		if (!!msg.ext.extraType) {
			type = "ext"
		}
	} catch (error) {

	}
	let dataItem = {
		text: msg.data,
		time: now,
		type: type,
		mid: msg.type + msg.id,
		send: send
	}
	if (data.length > 0) {
		for (let i = 0; i < data.length; i++) {
			if ((data[i].listid == msg.from && !send) || (data[i].listid == msg.to && send)) {
				if (type == 'emoji' || type == 'txt') {
					if (!Array.isArray(dataItem.text)) {
						dataItem.text = emojiDataInit(dataItem.text)
					}

					data[i].data.push(dataItem)

				} else if (type == 'img' || type == 'audio') {
					dataItem.text = msg.url
					dataItem.name = msg.filename
					dataItem.accessToken = msg.accessToken
					if (type == 'audio') dataItem.length = msg.length
					data[i].data.push(dataItem)
				} else if (type === "ext") {
					dataItem.text = msg.ext
					data[i].data.push(dataItem)
				} else if (type === "admin") {
					dataItem.ext = msg.ext
					if (!Array.isArray(dataItem.text)) {
						dataItem.text = emojiDataInit(dataItem.text)
					}
					data[i].data.push(dataItem)
				}
				if (!send) {
					// 未读
					data[i].unread = ++data[i].unread
				}
				data.unshift(data.splice(i, 1)[0]);
				util.setLocal('msgList', data);
				return new Promise((resolve, reject) => {
					resolve(data)
				})
			} else {}
		}
	}
	var obj = {
		id: msg.id,
		to: msg.to,
		from: msg.from,
		data: [],
		unread: 1,
		listid: send ? msg.to : msg.from
	}
	if (type == 'emoji' || type == 'emoji') {
		if (!Array.isArray(dataItem.text))
			dataItem.text = emojiDataInit(dataItem.text)
		obj.data = [dataItem]
	} else if (type == 'img' || type == 'audio') {
		dataItem.text = msg.url
		dataItem.name = msg.filename
		dataItem.accessToken = msg.accessToken
		if (type == 'audio') dataItem.length = msg.length
		obj.data = [dataItem]
	} else if (type === "ext") {
		dataItem.text = msg.ext
		obj.data = [dataItem]
	} else if (type === "admin") {
		dataItem.ext = msg.ext
		if (!Array.isArray(dataItem.text)) {
			dataItem.text = emojiDataInit(dataItem.text)
		}
		obj.data = [dataItem]
		obj.avatar = 'https://wx.onechuan.com/api_test/images/wx/send_blue.png';
		obj.name = '小传';
		obj.friendStatus = '';
		obj.companyName = '';
		obj.positionName = '';
		data.unshift(obj)
		if (data instanceof Array) {
			util.setLocal("msgList", data)
		}
		return new Promise((resolve, reject) => {
			resolve(data)
		})
	}
	return WebIM.addInfo(obj, data)
}
// addInfo(util.getLocal("msgList"))
WebIM.addInfo = (obj) => {
	return new Promise((resolve, reject) => {
		req_fn
			.req("api/user/" + obj.listid + "/simple-info", {}, "post")
			.then(res => {
				let data = wx.getStorageSync('msgList') != '' ? wx.getStorageSync('msgList') : [];
				if (res.code == 0) {
					obj.avatar = res.data.avatar.indexOf('http') == -1 ? req_fn.imgUrl + res.data.avatar : res.data.avatar;
					obj.keywordList = obj.keywordList != null ? res.data.keywordList.split(',') : [];
					obj.name = res.data.name;
					obj.friendStatus = res.data.friendStatus;
					try {
						obj.companyName = res.data.userCard.companyName
						obj.positionName = res.data.userCard.positionName
					} catch (error) {
						obj.companyName = '';
						obj.positionName = ''
					}

				} else {
					if (!obj.name) {
						obj.avatar = '';
						obj.name = '';
						obj.friendStatus = '';
						obj.companyName = '';
						obj.positionName = '';
					}
				}
				for (let i = 0; i < data.length; i++) {
					if (data[i].listid === obj.listid) {
						data[i].data.push(obj.data[0])
						if (obj.data[0].send) {
							// 未读
							data[i].unread = ++data[i].unread
						}
						obj = data.splice(i, 1)[0]
					} else {}
				}
				//  friendStatus:"myself"
				data.unshift(obj)
				if (data instanceof Array) {
					util.setLocal("msgList", data)
				}
				resolve(data);
			}).catch(err => {
				if (obj instanceof Array) {
					util.setLocal("msgList", obj)
				}
				reject(obj, err)
			});

	})

}
// async response
// WebIM.conn.listen({
//   onOpened: () => dispatch({type: Types.ON_OPEND})
// })
// export default WebIM;
module.exports = {
	"default": WebIM
};