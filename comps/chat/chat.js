let timeoutId = null
let LIST_STATUS = {
  SHORT: 'scroll_view_change', //键盘
  NORMAL: 'scroll_view', //正常
  EMOJI: 'scroll_view_menu' //表情/菜单
}
let WebIM = require("../../utils/WebIM")["default"];
let msgType = require("./msgtype");
Component({
  properties: {
    // username: {
    // 	type: Object,
    // 	value: {},
    // },
    userId: {
      type: String,
      value: {}
    },
    chatType: {
      type: String,
      value: 'singleChat' //默认单聊// chatRoom 群聊
    }
  },
  data: {
    isManKeepShow: false, //个人名片
    isIPX: getApp().globalData.isIPX,
    view: LIST_STATUS.NORMAL, //控制聊天盒子大小
    styleKeyboard: '', //键盘tryle
    __comps__: {
      msglist: null,
      inputbar: null
    },
    recording: {
      status: 0, // 0未开始 1 开始保存 2 开始不保存   录音状态
      minutes: '0:01'
    },
    inputHeight: 100,
    inputBottmo: 0,
    isEmoji: false //是否表情/菜单
  },
  methods: {
    normalScroll() {
      // 关闭键盘
      wx.hideKeyboard()
      this.normalBox()
      this.data.__comps__.inputbar.cancelEmoji()
      this.data.__comps__.msglist.close()
    },
    // 改变列表的padding-bottom
    listStart(e) {
      let state = e.detail
      //console.log(state)
      if (state == 0)
        // 聊天列表恢复正常
        this.normalBox()
      // if (state == 1) {
      // 	// 聊天列表变短键盘
      // 	this.shortBox();
      // 	this.data.__comps__.msglist.scrollBottom()
      // }
      if (state == 2) {
        // 聊天列表变短表情
        this.emojiBox()
        this.data.__comps__.msglist.scrollBottom()
      }
    },
    // 发送完毕
    saveSendMsg(evt) {
      this.data.__comps__.inputbar.cancelEmoji()
    },

    // 聊天记录下拉刷新
    getMore() {
      this.data.__comps__.msglist.renderMsg(true)
    },
    // 更新聊天数据
    refresh() {
      setTimeout(() => {
        this.data.__comps__.msglist.renderMsg()
      }, 100)
    },
    // 语音状态
    recordingstatus(e) {
      let temp = 1
      if (e.detail == 1 && timeoutId == null) {
        timeoutId = setInterval(() => {
          temp++
          this.setData({
            'recording.minutes': `${parseInt(temp / 60)}:${
              temp % 60 > 9 ? temp % 60 : '0' + (temp % 60)
            }`
          })
        }, 1000)
      } else if (e.detail == 0) {
        clearInterval(timeoutId)
        timeoutId = null
        this.setData({
          'recording.minutes': '0:01'
        })
      }
      this.setData({
        'recording.status': e.detail
      })
    },
    // 聊天列表恢复正常
    normalBox(isk) {
      if (isk && this.data.isEmoji) return
      this.setData({
        view: LIST_STATUS.NORMAL,
        styleKeyboard: '',
        inputBottmo: 0,
        isEmoji: false
      })
    },
    // 聊天列表变短键盘
    shortBox(keyboardHeight) {
      this.setData({
        styleKeyboard: `${this.data.inputHeight + keyboardHeight}px`,
        inputBottmo: `${keyboardHeight}px`,
        view: '',
        isEmoji: false
      })
      this.data.__comps__.msglist.scrollBottom()
    },
    // 聊天列表变短表情
    emojiBox() {
      this.setData({
        styleKeyboard: '',
        view: LIST_STATUS.EMOJI,
        inputBottmo: 0,
        isEmoji: true
      })
    },
    // 显示发送个人名片
    showManKeep() {
      this.setData({
        isManKeepShow: true
      })
    },
    // 选中个人名片
    checkedItem(e) {
      let data = e.detail
      //console.log(data);
      this.setData({
        isManKeepShow: false
      })
      let ext = {
        avatar: data.avatar,
        companyName: data.userCard.companyName,
        extraType: "manKeep",
        name: data.name,
        userId: data.userId,
        userShortId: data.userShortId
      }
      this.sendMessage(ext)
    },
    // 发送消息
    sendMessage(ext) {
      let _this = this
      let id = WebIM.conn.getUniqueId();
      let msg = new WebIM.message(msgType.TEXT, id);
      msg.set({
        msg: 'ext', // 消息内容
        to: _this.properties.userId, // 接收消息对象（用户id） 
        roomType: false,
        ext: ext, // 扩展消息
        success: (id, serverMsgId) => {
          let msg = {
            id: serverMsgId,
            to: _this.properties.userId,
            from: WebIM.userIm.easemobUserId,
            data: ext,
            ext: ext
          };
          WebIM.saveMsg(msg, _this.data.type, true).then(res => {
            _this.refresh()
          }).catch(error => {
            //console.log(error,'发送消息失败')
          });
        },
        fail: (e) => {
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
  ready() {
    let _this = this
    // 监听键盘高度变化
    wx.onKeyboardHeightChange(res => {
      //console.log(res.height)
      if (res.height > 0 && res.height > 110) {
        //console.log('键盘了')
        _this.shortBox(res.height)
      } else if (res.height === 0) {
        //console.log('没了')
        _this.normalBox(true)
      }
    })

    const query = _this.createSelectorQuery()
    query.select('#chat-inputbar').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      _this.setData({
        inputHeight: res[0].height
      })
    })

    if (getApp().globalData.isIPX) {
      LIST_STATUS.NORMAL = 'scroll_view_X'
      LIST_STATUS.EMOJI = 'scroll_view_menu_X'
      _this.setData({
        view: LIST_STATUS.NORMAL,
        isIPX: true
      })
    }

    _this.data.__comps__.inputbar = _this.selectComponent('#chat-inputbar')
    _this.data.__comps__.msglist = _this.selectComponent('#chat-msglist')
  },
  moved() {},
  detached() {}
})