// 即时聊天的配置项


let location = {
	protocol: "https"
};

let config = {
	// xmpp服务器的URL
	xmppURL: "wss://im-api.easemob.com/ws/",
	// API服务器的URL
	apiURL: "https://a1.easemob.com",
	/*
	 * Application AppKey
	 */
	appkey: "1104190909098397#onechuan",
	// 是否启用wss.
	https: false,
	// 为true时同一账户可以同时在多个Web页面登录（ 多标签登录， 默认不开启， 如有需要请联系商务）， 为false时同一账号只能在一个Web页面登录
	isMultiLoginSessions: false,
	// 是否运行在WindowsSDK上
	isWindowSDK: false,
	// 掉线后重连的最大次数
	autoReconnectNumMax: 15,
	// 掉线后重连的间隔时间（ 毫秒）
	autoReconnectInterval: 2,
	// 登录成功后是否自动出席
	isAutoLogin: true,
	//发送心跳包的时间间隔（毫秒）
	heartBeatWait: 4500,
	// 已送达回执 在收到消息时会自动发送已送达回执，对方收到已送达回执的回调函数是 onDeliveredMessage
	delivery: true

	// /**
	//  * webrtc supports WebKit and https only
	//  */
	// isWebRTC: false,
	// /**
	//  * isSandBox=true:  xmppURL: 'im-api.sandbox.easemob.com',  apiURL: '//a1.sdb.easemob.com',
	//  * isSandBox=false: xmppURL: 'im-api.easemob.com',          apiURL: '//a1.easemob.com',
	//  * @parameter {Boolean} true or false
	//  */
	// isSandBox: false,
	/**
	 * Whether to //console.log in strophe.log()
	 * @parameter {Boolean} true or false
	 */
	// isDebug: false,
};

export default config;