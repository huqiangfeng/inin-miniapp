// pages/email//demandCompany/demandCompany.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
let wait = false //判断是否已经有接口调用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    company: {},
    isAuth: false, //已认证
    peopleData: [],
    loading: true,
    loadingShow: false,
    hasNone: false, // 是否调用接口
    login: false,
    delta: 1, //回退页面
    shareFlag: true, //分享的modal
    shareVideoObj: null,
    getVisitOnshow: null,
    videoNum: 0,
    xuqiuNum: 0,
    visitNum: 0,
    sendMsg: 0,
    activeList: 'V',
    activeNav: 0,
    stateModal: false, //状态框
    scrollActive: false, // 滑动改变
    readStatus: '', //登录用户已读未读状态，read-已读、unread-未读
    navList: [{
      name: '视频',
      value: 'V'
    }, {
      name: '需求',
      value: 'X'
    }, {
      name: '拜访',
      value: 'S'
    }, {
      name: '推送',
      value: 'T'
    }],
    modalData: [{
        k: '全部状态',
        v: '',
        checked: true
      },
      {
        k: '状态为已读',
        v: 'read',
        checked: false
      },
      {
        k: '状态为未读',
        v: 'unread',
        checked: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let companyInfo = util.getLocal('companyInfo')
    // if (companyInfo.name.length > 10) {
    //   companyInfo.name = companyInfo.name.substring(0, 11) + '...'
    // }
    // 设置标题
    wx.setNavigationBarTitle({
      title: companyInfo.name.length > 10 ? companyInfo.name.substring(0, 11) : companyInfo.name
    });
    this.setData({
      company: companyInfo,
      delta: options.delta ? Number(options.delta) : 1
    })
  },
  getNavTotalNumber() {
    // /api/company/{id}/statistic
    // /api/company/{id}/mailbox-amount  获取企业收件箱列表数量，全部数量、已读数、未读数
    // 
    req_fn.req('api/company/' + this.data.company.id + '/statistic', {}, "get").then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: '获取数量失败',
          icon: 'none',
          duration: 2000
        })

      } else {
        this.setData({
          videoNum: res.data.vodAmount,

          sendMsg: res.data.newsAmount,
        })
      }
    })
  },
  // 获取拜访导航栏的未读数
  getVisitUnreadNum() {
    req_fn.req('api/my/mailbox-amount', {
      access_token: util.getLocal('Login').inin.access_token,
      requirementType: 'visit'
    }, "get").then(res => {
      this.setData({
        visitNum: res.data.processingAmount,
      })
    })
  },
  // 获取导航栏的需求未读数
  getXuqiuUnreadNum() {
    req_fn.req('api/company/' + this.data.company.id + '/mailbox-amount', {
      access_token: util.getLocal('Login').inin.access_token
    }, "post").then(res => {
      console.log(res, '获取导航栏的需求未读数')
      if (res.code != 0) {
        wx.showToast({
          title: '获取数量失败',
          icon: 'none',
          duration: 2000
        })

      } else {
        this.setData({
          xuqiuNum: res.data.loginUserUnreadAmount,
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    let companyInfo = util.getLocal('companyInfo');
    let shareVideoObj = this.data.shareVideoObj;
    let name, companyName, coverUrl, playUrl, title, lookdNum, createTime, description;
    name = shareVideoObj.user.name;
    playUrl = shareVideoObj.vod.playUrl;
    lookdNum = shareVideoObj.vod.lookdNum;
    createTime = shareVideoObj.vod.createTime;
    description = shareVideoObj.vod.description;

    return {
      title: companyInfo.name.length > 10 ? companyInfo.name.substring(0, 11) : companyInfo.name,
      path: '/pages/email/videoShare/videoShare?playUrl=' + playUrl + "&lookdNum=" + lookdNum + '&name=' + name + "&companyName=" + companyName + "&coverUrl=" + coverUrl + "&createTime=" + createTime + "&description=" + description
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let setData = {
      login: !!util.isLogin()
    }
    if (setData.login) {
      this.hasAttestation(); //是否认证
      // this.getData();
      this.isCollect(); //是否收藏
    }

    this.setData(setData)

    if (app.globalData.url == "back") {
      this.setData({
        peopleData: [],
        hasNone: false
      })
      delete app.globalData.url;
    }
    this.getData();
    this.selectComponent('#visitResult').getVisitList(this.data.getVisitOnshow);
    this.getMailboxAmount(); //收件箱列表数量
    this.getNavTotalNumber(); //获取导航栏的数量
    this.getXuqiuUnreadNum();
    this.getVisitUnreadNum()
  },
  currentStatus(e) {
    let _key = e.detail;
    switch (_key) {
      case 0:
        this.setData({
          getVisitOnshow: null
        })
        break;
      case 1:
        this.setData({
          getVisitOnshow: 'read'
        })
        break;
      case 2:
        this.setData({
          getVisitOnshow: 'unread'
        })
        break;
    }

  },
  compontpass(clickVideoInfo) {
    this.setData({
      shareFlag: false,
      shareVideoObj: clickVideoInfo.detail
    })
  },
  // 隐藏分享的modal
  hdieModal() {
    this.setData({
      shareFlag: true,
      shareVideoObj: null
    })
  },
  // 获取企业收件箱列表数量
  getMailboxAmount() {
    if (!util.isLogin()) {
      return
    }
    req_fn
      .req(`/api/company/${this.data.company.id}/mailbox-amount`, {

      }, "post")
      .then(res => {
        let modalData = this.data.modalData
        modalData[0].k = modalData[0].k + `（${ res.data.totalAmount  }封）`
        modalData[1].k = modalData[1].k + `（${ res.data.loginUserReadAmount  }封）`
        modalData[2].k = modalData[2].k + `（${ res.data.loginUserUnreadAmount  }封）`
        this.setData({
          modalData: modalData
        })
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      hasNone: false
    })
    if (this.peopleData.length != 0)
      this.getData("after", this.peopleData[0].createTime);
    else this.getData();
    wx.startPullDownRefresh();
  },
  // 点击某一项
  ontapItem(e) {
    let index = e.detail.index
    if (!this.data.isAuth && index > 2) {
      return
    }
    wx.navigateTo({
      url: `/pages/email/cooperationOrfinancing/cooperationOrfinancing?companyId=${ this.data.company.id}&index=${index}`,
    })
  },
  // 滚动事件
  on_scroll(e) {
    let scrollTop = e.detail.scrollTop
    if (scrollTop < 64 && this.data.scrollActive) {
      this.setData({
        scrollActive: false
      })
    } else if (scrollTop > 64 && !this.data.scrollActive) {
      this.setData({
        scrollActive: true
      })
    }
  },
  // 触底事件的处理函数
  on_scrollLower() {
    if (this.data.activeList == 'X') {
      // this.setData({
      //   hasNone: false,
      //   loadingShow: true,
      //   loading: true
      // })
      // if (this.data.peopleData.length != 0) {
      //   console.log(this.data.peopleData[this.data.peopleData.length - 1].createTime)
      //   this.getData("before",this.data.peopleData[this.data.peopleData.length - 1].createTime
      //   );
      // } else {
      //   this.getData();
      // }
      let currentPeopleData = this.data.peopleData;
      let url = "public/company/" + this.data.company.id + "/mailboxes";
      if (this.data.login) {
        url = "api/company/" + this.data.company.id + "/mailboxes";
      }
      if (currentPeopleData.length != 0) {
        req_fn.req(url, {
          timeDirection: 'before',
          lastTime: currentPeopleData[currentPeopleData.length - 1].createTime,
          readStatus: this.data.readStatus
        }, "post").then(res => {
          if (res.code == 0) {
            let moreResponse = this.changeAvatar(res.data);
            if (moreResponse.length != 0) {
              let newMoreData = currentPeopleData.concat(moreResponse)

              this.setData({
                peopleData: newMoreData
              })
            } else {
              wx.showToast({
                title: "暂无新数据",
                icon: "none",
                duration: 1000
              })
            }
          } else {
            wx.showToast({
              title: "加载数据失败",
              icon: "none",
              duration: 1000
            })
          }
        })
      }
    }
  },
  // 切换nav
  on_checkdeNav(e) {
    //console.log(e.detail,'e.detail')
    this.setData({
      activeList: e.detail
    })
  },
  switchNav(e) {
    this.setData({
      activeList: e.currentTarget.dataset.value,
      activeNav: Number(e.currentTarget.dataset.index)
    })
  },
  // 显示状态选择框
  on_stateShow() {
    this.setData({
      stateModal: true
    })
  },
  // 隐藏状态选择框
  on_stateHidden() {
    this.setData({
      stateModal: false
    })
  },
  // 状态选中

  on_modalChecked(e) {
    let index = e.currentTarget.dataset.index
    let readStatus
    this.data.modalData.forEach((item, i) => {
      if (i == index) {
        item.checked = true
        readStatus = item.v
      } else {
        item.checked = false
      }
    });
    this.setData({
      modalData: this.data.modalData,
      readStatus: readStatus
    })
    this.on_stateHidden()
    this.getData();
  },
  // ----
  // 获取企业收件箱列表 after上翻(列表排序从旧到新)，before下翻(列表排序从新到旧)
  getData(timeDirection = "before", lastTime = "") {
    this.setData({
      hasNone: false
    })
    if (app.globalData.url == "cardInfo") delete app.globalData.url;
    else
      wx.showLoading({
        title: "加载中"
      });

    let url = "public/company/" + this.data.company.id + "/mailboxes";
    if (this.data.login) {
      url = "api/company/" + this.data.company.id + "/mailboxes";
    }
    req_fn
      .req(url, {
        timeDirection: timeDirection,
        lastTime: lastTime,
        readStatus: this.data.readStatus
      }, "post")
      .then(data => {
        this.setData({
          hasNone: true
        })
        if (data.code == 0) {
          if (data.data.length == 0) {
            this.setData({
              peopleData: []
            })
            wx.hideLoading();
            return;
          }
          if (this.data.isAuth == false) { //没有认证，只能看前三条数据
            //console.log(this.data.isAuth,'认证',timeDirection)
            //console.log(data.data.length,'企业收件箱列表')
            if (data.data != null) this.changeAvatar(data.data);

            if (timeDirection == "after") {
              //上一页
              data.data.reverse();
              let tempArr = [...data.data, ...this.data.peopleData];
              let peopleDataArr = [];
              if (data.data != null) {
                for (let index = 0; index < 3; index++) {
                  peopleDataArr.push(tempArr[index])
                }
              }
              this.setData({
                peopleData: peopleDataArr
              })
              // wx.stopPullDownRefresh();
            } else {
              //下一页
              if (lastTime != "") {
                let tempArr = [...this.data.peopleData, ...data.data];
                let peopleDataArr = [];
                for (let index = 0; index < 3; index++) {
                  peopleDataArr.push(tempArr[index])
                }
                this.setData({
                  loading: false,
                  peopleData: peopleDataArr
                })
              } else {
                let tempArr = data.data;
                let peopleDataArr = [];
                for (let index = 0; index < 3; index++) {
                  peopleDataArr.push(tempArr[index])
                }
                this.setData({
                  peopleData: peopleDataArr
                })
              }
            }
          } else {
            if (data.data != null) this.changeAvatar(data.data);
            if (timeDirection == "after") {
              //上一页
              data.data.reverse();
              this.setData({
                peopleData: [...data.data, ...this.data.peopleData]
              })
              // wx.stopPullDownRefresh();
            } else {
              //下一页
              if (lastTime != "") {
                this.setData({
                  loading: false,
                  peopleData: [...this.data.peopleData, ...data.data]
                })
              } else {
                this.setData({
                  peopleData: data.data
                })
              }
            }
          }

        } else if (data.data == null) {
          // 没有上一页或者下一页
        } else {
          wx.showToast({
            title: data.msg,
            icon: "none",
            duration: 2000
          });
        }
        //console.log(timeDirection + " 获取企业收件箱列表: ", data);
        setTimeout(() => {
          wx.hideLoading();
        }, 100);
      })
      .catch(err => {
        this.setData({
          hasNone: false
        })
        wx.hideLoading();
        //console.log(err);
        // wx.showToast({
        //   title: "加载失败",
        //   icon: "none",
        //   duration: 2000
        // });
      });
  },
  // 映射头像
  changeAvatar(arr) {
    for (let i in arr) {
      if (
        arr[i].sendUserAvatar &&
        arr[i].sendUserAvatar.indexOf("http") == -1
      ) {
        arr[i].sendUserAvatar = req_fn.imgUrl + arr[i].sendUserAvatar;
      }
      arr[i].time = util.getDate(arr[i].createTime);
      arr[i].keywords = arr[i].keywords.split(",");
      // @repair 公司别名  /\W/g
      arr[i].rename = arr[i].sendUserCompany
        .replace(/(.*?(省|区|市))/, "")
        .substring(0, 2);
    }
    return arr;
  },
  // 图片加载失败
  titleImgErr(e) {
    let company = this.data.company
    company[e.detail.type] = null
    this.setData({
      company: company
    })
  },
  // 判断是否收藏
  isCollect() {
    req_fn
      .req(
        "api/user/company/" + this.data.company.id + "/is-collected", {},
        "post"
      )
      .then(res => {
        if (res.code == 0)
          this.setData({
            'company.isCollect': res.data
          })
        //console.log("是否收藏: ", res);
      });
  },
  // 收藏
  onCollect() {
    if (wait) return
    if (this.data.login) {
      wait = true
      let url = "";
      let reqObj = {};
      if (this.data.company.isCollect) {
        url = "api/user/company/collection/delete-by-company-id";
        reqObj = {
          companyId: this.data.company.id
        }
      } else {
        url = "api/user/company/collection";
        reqObj = {
          id: this.data.company.id
        }
      }
      req_fn.req(url, reqObj, "post").then(res => {
        if (res.code == 0) {
          this.setData({
            'company.isCollect': !this.data.company.isCollect
          })
          wx.showToast({
            title: this.data.company.isCollect ? "收藏成功" : "取消成功",
            icon: 'none',
            duration: 1500
          });
          // this.getData();
        }
        setTimeout(() => {
          wait = false
        }, 1000);
      }).catch(() => {
        wx.showToast({
          title: "网络错误，请稍后重试",
          icon: 'none',
          duration: 1500
        });
        setTimeout(() => {
          wait = false
        }, 1000);
      })


    } else {
      util.modalIsLogin("立即收藏", "登录后可收藏，前往登录？")
    }
  },
  // 是否认证
  hasAttestation() {
    req_fn.req("api/user/card/authed", {}, "post").then(data => {
      if (data.code == 0) {
        //console.log(data,'是否认证')
        this.setData({
          isAuth: data.data
        })
      } else {
        wx.showToast({
          title: data.msg,
          icon: 'none',
          duration: 1500
        });
      }
    });
  },
  // 一键投递
  send() {
    if (!this.data.company.canSendRequirement) {
      wx.showToast({
        title: "24小时内不能重复投递",
        icon: "none",
        durtation: 2000
      });
    } else if (this.data.isAuth) {
      let companyInfo = util.getLocal("card");
      companyInfo.companyId = this.data.company.id;
      companyInfo.nameCompany = this.data.company.name;
      let tempString = JSON.stringify(companyInfo);
      wx.navigateTo({
        url: "/pages/email/outDemandCard/outDemandCard?companyInfo=" + encodeURIComponent(tempString)
      });
    } else {
      this.toAttestation();
    }
    //console.log(app.globalData);
  },
  // 去登录
  toLogin() {
    app.pageIndex = util.logoToPage()
    wx.navigateTo({
      url: "/pages/home/login/login"
    });
  },
  // 去认证
  toAttestation() {
    wx.navigateTo({
      url: "/pages/email/authentication/authentication?card=" +
        JSON.stringify(util.getLocal("card"))
    });
  }
})