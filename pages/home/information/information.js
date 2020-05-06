const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    isAdminMsg:false,//是否有小传的信息过来
    msgSum: 0, //未读聊天数量
    msg2: 0, //未读好友请求数量
    msg3: 0, //未读系统通知数量
    lists: [], // 会话列表
    confirmDel: false, // 是否确认删除
    delBtnId: "", //要删除的id
    watch: 0, //自己写的计算属性用于小红点
    slideButtons1: [{ // 删除滑块的配置
      type: 'warn',
      text: ' 删除 ',
    }],
    slideButtons2: [{ // 删除滑块的配置
      type: 'warn',
      text: '确认删除',
    }],
	allMessageList:[],
	messageList:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Object.defineProperty(this.data, 'watch', {
      set: val => {
        this.setDot()
      },
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {
    let adminMsg = wx.getStorageSync('adminMsg');
    if(adminMsg){
      this.setData({
        isAdminMsg:true
      })
    }else{
      this.setData({
        isAdminMsg:false
      })
    }
		app.onMessage = e => {
		  console.log(e,'onMessage')
		  this.setData({
		    lists: this.setListDate(e),
		    msgSum: this.getUnreadSum(e),
		    watch: 1
		  })
		};
		if (util.getLocal("msgList")) {
		  this.setData({
		    lists: this.setListDate(util.getLocal("msgList")),
		    msgSum: this.getUnreadSum(util.getLocal("msgList")),
		    watch: 1
		  })
		}
		// 获取好友请求和系统通知未读数量
		this.getMsg();
		this.setData({
		delBtnId: '',
		confirmDel: false
		})
	  },
	  formatterMessage(list){
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			
		}
	  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      lists: []
    })
  },
  // 跳到搜索页
  onChangePageSearch(e) {
    // this.getCompanyId();
    wx.navigateTo({
      url: "/pages/im/search/search"
    });
  },
  // 获取好友请求/系统通知，未读消息条数
  getMsg() {
    req_fn.req("api/user/sys-msg/msg-unread", {}, "post").then(res => {
      if (res.code == 0) {
        this.setData({
          msg2: res.data.friendApplyUnread,
          msg3: res.data.sysMsgUnread,
          watch: 1
        })
      } else if (res.code != "40001") {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        });
      } else {
        setTimeout(() => {
          this.getMsg();
        }, 1500);
      }
      //console.log(res);
    });
  },
  // 头部消息-页面跳转
  changePages(e) {
    let index = e.currentTarget.dataset.index
    if (util.isLogin()) {
      let url = "";
      switch (index) {
        case "1": {
          url = "/pages/im/addFriend/addFriend";
          break;
        }
        case "2": {
          url = "/pages/im/friendRequest/friendRequest";
          this.setData({
            msg2: 0,
            watch: 0
          })
          break;
        }
        case "3": {
          url = "/pages/im/systemMessages/systemMessages";
          this.setData({
            msg3: 0,
            watch: 0
          })
          break;
        }
      }
      wx.navigateTo({
        url: url
      });
    } else {
      util.modalIsLogin()
    }
  },
  // 聊天页面跳转
  changePage(e) {
    let index = e.currentTarget.dataset.index
    let lists = this.data.lists
    lists[index].unread = 0
    if (lists instanceof Array) {
      util.setLocal("msgList", lists)
    }
    this.setData({
      lists: lists
    })
    wx.navigateTo({
      url: "/pages/im/chat/chat?id=" + lists[index].listid.replace("p2p-", "")
    });


  },
  // 设置时间格式化
  setListDate(list) {
    for (let i = 0; i < list.length; i++) {
      list[i].data[list[i].data.length - 1].day = util.getDate(list[i].data[list[i].data.length - 1].time);
    }
    return list
  },
  // 得到总未读数
  getUnreadSum(list) {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
      sum += list[i].unread
    }
    return sum
  },
  // 设置红点
  setDot() {
    let data = this.data
    if (data.msgSum > 0 || data.msg2 > 0 || data.msg3 > 0) {
      wx.showTabBarRedDot({
        index: 0,
      })
    } else {
      wx.hideTabBarRedDot({
        index: 0
      })
    }
  },
  // 滑块删除
  del(index) {
    let lists = this.data.lists
    lists.splice(index, 1);
    if (lists instanceof Array) {
      util.setLocal("msgList", lists)
    }
    this.setData({
      lists: lists
    })
  },

  // 点击删除按钮
  slideButtonTap(e) {
    let index = e.detail.index
    let id = this.data.lists[index].id

    if (this.data.confirmDel && this.data.delBtnId == id) {
      this.del(index)
      this.setData({
        delBtnId: '',
        confirmDel: false
      })
    } else {
      this.setData({
        delBtnId: id,
        confirmDel: true
      })
    }

  },
  hideDel(e) {
    let index = e.detail.index
    this.setData({
      delBtnId: '',
      confirmDel: false
    })

  },
  showDel(e) {
    let index = e.detail.index
    this.setData({
      delBtnId: '',
      confirmDel: false
    })
  }
})