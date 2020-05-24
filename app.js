//app.js
require("sdk/libs/strophe");
let WebIM = require("utils/WebIM")["default"];
let logout = false;
const util = require('./utils/util')
// 判断是否是错误
function onMessageError(err) {
  if (err.type === "error") {
    wx.showToast({
      title: err.errorText,
      icon: 'none',
      duration: 1500
    });
    return false;
  }
  return true;
}
App({
  globalData: {
    unReadMessageNum: 0,
    userInfo: null,
    saveFriendList: [],
    saveGroupInvitedList: [],
    isIPX: false, //是否为iphone X
    company: "", //公司
    webSocket: false,
    locationAuth: false, //时候有定位权限
    currentLat: '',
    currentLng: '',
    worker: null
  },
  conn: {
    closed: false,
    curOpenOpt: {},
    open() {
      WebIM.userIm = util.getLocal('Login').im
      let opt = {
        apiUrl: WebIM.config.apiURL,
        appKey: WebIM.config.appkey,
        user: WebIM.userIm.easemobUserId,
        pwd: WebIM.userIm.easemobPwd,
        delivery: WebIM.config.delivery
      }
      wx.showLoading({
        title: '正在初始化客户端...',
        mask: true
      })
      this.curOpenOpt = opt;
      WebIM.conn.open(opt);
      this.closed = false;
      getApp().globalData.webSocket = true

    },
    reopen() {
      if (this.closed) {
        //this.open(this.curOpenOpt);
        WebIM.conn.open(this.curOpenOpt);
        this.closed = false;
      }
    }
  },

  onLaunch() {
    var that = this;
    // 获取当前的位置信息
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.globalData.currentLat = res.latitude;
        that.globalData.currentLng = res.longitude;
        that.globalData.locationAuth = true;
      },
      fail() {
        that.globalData.currentLat = '';
        that.globalData.currentLng = '';
        that.globalData.locationAuth = false;
      }
    });
    // 调用 API 从本地缓存中获取数据
    wx.setInnerAudioOption({
      // 	（仅在 iOS 生效）是否遵循静音开关，设置为 false 之后，即使是在静音模式下，也能播放声音
      obeyMuteSwitch: false
    })
    var me = this;

    WebIM.conn.listen({
      // 处理登录的回调
      onOpened(message) {
        console.log('连接成功回调')
        WebIM.conn.setPresence();
      },
      // 重连中
      onReconnect() {
        // wx.showToast({
        //   title: "重连中...",
        //   icon: 'none',
        //   duration: 2000
        // });
      },
      // 连接成功
      onSocketConnected() {
        wx.showToast({
          title: "连接成功",
          icon: 'none',
          duration: 1500
        });
      },
      // 网络已断开
      onClosed() {
        wx.showToast({
          title: "网络已断开",
          icon: 'none',
          duration: 1500
        });
        wx.redirectTo({
          url: "/pages/home/login/login"
        });
        me.conn.closed = true;
        WebIM.conn.close();
      },
      // 处理邀请消息的回调 /.....已邀你入群
      onInviteMessage(message) {
        //console.log(message);

      },
      // 处理Presence消息的回调  如添加好友
      onPresence(message) {
        //console.log("onPresence", message);
        switch (message.type) {
          case "unsubscribe":
            // pages[0].moveFriend(message);
            break;
            // 好友邀请列表
          case "subscribe":
            if (message.status === "[resp:true]") {

            } else {
              // 
            }
            break;
          case "subscribed":
            wx.showToast({
              title: "添加成功",
              icon: 'none',
              duration: 1500
            });
            // 
            break;
          case "unsubscribed":
            // wx.showToast({
            // 	title: "已拒绝",
            // 	duration: 1500
            // });
            break;
          case "memberJoinPublicGroupSuccess":
            wx.showToast({
              title: "已进群",
              icon: 'none',
              duration: 1500
            });
            break;
            // 删除好友
          case "unavailable":
            // 

            break;

          case 'deleteGroupChat':
            // 
            break;

          case "leaveGroup":
            // 
            break;

          case "removedFromGroup":
            // 
            break;
            // case "joinChatRoomSuccess":
            // 	wx.showToast({
            // 		title: "JoinChatRoomSuccess",
            // 	});
            // 	break;
            // case "memberJoinChatRoomSuccess":
            // 	wx.showToast({
            // 		title: "memberJoinChatRoomSuccess",
            // 	});
            // 	break;
            // case "memberLeaveChatRoomSuccess":
            // 	wx.showToast({
            // 		title: "leaveChatRoomSuccess",
            // 	});
            // 	break;

          default:
            break;
        }

      },

      onRoster(message) {
        //console.log('onRoster', message);

      },

      // 处理视频消息的回调
      onVideoMessage(message) {
        //console.log("处理视频消息的回调: ", message);

        WebIM.ack(message);
      },
      // 处理音频消息的回调
      onAudioMessage(message) {
        //console.log("处理音频消息的回调", message);

        WebIM.saveMsg(message, 'audio').then(res => {
          getApp().onMessage(res); //调用全局方法
        });
        WebIM.ack(message);

      },
      // 	处理命令消息的回调
      onCmdMessage(message) {
        //console.log("处理命令消息的回调", message);
        // 已读
        WebIM.ack(message);
      },
      // 处理位置消息的回调
      onLocationMessage(message) {
        //console.log("处理位置消息的回调", message);
      },
      // 处理文本消息的回调
      onTextMessage(message) {
        if (message.from == 'admin') {
          console.log(message, 'this is message from admin')
          util.setLocal('adminMsg', message.data)
        }
        if (onMessageError(message)) {
          WebIM.saveMsg(message, 'txt').then(res => {
            console.log(res, 'onMessageError')
            getApp().onMessage(res); //调用全局方法
          });
        }
      },
      // 处理表情消息的回调
      onEmojiMessage(message) {
        //console.log("处理表情消息的回调", message);
        if (onMessageError(message)) {
          WebIM.saveMsg(message, 'emoji').then(res => {
            getApp().onMessage(res); //调用全局方法
          });
        }
        WebIM.ack(message);

      },
      // 处理图片消息的回调
      onPictureMessage(message) {
        //console.log("处理图片消息的回调", message);
        if (onMessageError(message)) {
          WebIM.saveMsg(message, 'img').then(res => {
            getApp().onMessage(res); //调用全局方法
          });
        }
        //   WebIM.ack(message);
      },
      // 处理文件消息的回调
      onFileMessage(message) {
        //console.log('处理文件消息的回调', message);
        //   WebIM.ack(message);
      },
      //收到消息已读回执
      onReadMessage(message) {
        //console.log('收到消息已读回执');
      },
      // 收到撤回消息回执
      onRecallMessage() {
        //console.log('收到撤回消息回执');
      },
      // 各种异常 处理错误消息的回调
      onError(error) {
        //console.log(error)
        // 16: 服务器端关闭websocket连接
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED && !logout) {
          if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
            return;
          }
          wx.showToast({
            title: "网络错误",
            icon: 'none',
            duration: 1500
          });
          // // 发送链接请求
          // getApp().conn.open();
          wx.redirectTo({
            url: "/pages/home/login/login"
          });
          logout = true
          return;
        }
        // 8: offline by multi login  多重登录离线
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          wx.showToast({
            title: "多重登录离线，正在重新链接",
            icon: 'none',
            duration: 2500
          });
          // 发送链接请求
          getApp().conn.open();
          // wx.redirectTo({
          //   url: "/pages/home/login/login"
          // });
        }
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_OPEN_ERROR) {
          wx.hideLoading()
          // wx.showModal({
          // 	title: "用户名或密码错误",
          // 	confirmText: "OK",
          // 	showCancel: false
          // });
        }
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_AUTH_ERROR) {
          wx.hideLoading()
        }
        if (error.type == 'socket_error') { ///sendMsgError
          //console.log('socket_errorsocket_error', error)
          wx.showToast({
            title: "网络已断开",
            icon: 'none',
            duration: 2000
          });
          // wx.redirectTo({
          //   url: "/pages/home/login/login"
          // });
        }
      },
    });
    this.checkIsIPhoneX();
  },
  // 登录成功
  onLoginSuccess: function (myName) {
    wx.hideLoading()
    // wx.redirectTo({
    //   url: "../chat/chat?myName=" + myName
    // });
  },
  // 判断是否iphone X
  checkIsIPhoneX: function () {
    const me = this
    wx.getSystemInfo({
      success: function (res) {
        // 根据 model 进行判断
        if (res.model.search('iPhone X') != -1) {
          me.globalData.isIPX = true
        }
      }
    })
  },
  // 本地图片地址
  localImg: '/static/images/',
  // 首页
  pageIndex: false,

})