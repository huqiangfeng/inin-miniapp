// pages/personalInfo/myVisitBusiness/myVisitBusiness.js
const wxRequest = require('../../../utils/route')
const util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
	data: {
		downIcon:'../../../static/images/weixuanzhe.png',
		upIcon:'../../../static/images/yixuanzhe.png',
    animation:'',
    showSelectFlag:false,
    statusList:[
      {
        id:0,
        text:"全部状态",
        value: null
      },
      {
        id:1,
        text:"状态为联系成功",
        value: 'success'
      },
      {
        id:2,
        text:"状态为联系失败",
        value: 'failure'
      }
    ],
    currentStatusIndex:0,
    currentStatus: null,
    statusArr:[]
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitList();
    this.getStatusNumber()
  },
    /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
    
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow')
   
  },
  getInitList(){
    wx.showLoading({
      title: '加载中',
    })    
    let url = 'api/my/sendboxes';
    let data;
    if(this.data.currentStatus == null){
      data = {
        access_token:wx.getStorageSync('Login').inin.access_token,
        requirementType:'visit',
        size:100
      }
    }else{
      data = {
        access_token:wx.getStorageSync('Login').inin.access_token,
        requirementType:'visit',
        processStatus:this.data.currentStatus,
        size:100
      }
    }
    wxRequest.req(url,data,'post').then(res => {
      wx.hideLoading()
      if(res.code == 0){
        let response = res.data;
        let newArr = response.map(item => {
          return {...item,...{
            createTime:util.formatTime(item.createTime,true,false)
          }}
        })
        this.setData({statusArr:newArr})
      }
    })
  },
  itemChange(e){
    this.setData({currentStatus:e.detail})
    this.getInitList()
  },
  // 获取各个状态的数量
  getStatusNumber(){
    let url = 'api/my/mailbox-amount';
    let data = {
      access_token:wx.getStorageSync('Login').inin.access_token,
      requirementType:'visit'
    }
    wxRequest.req(url,data,"get").then(res => {
      let response = res.data;
      let allStatus = response.totalAmount;
      let successStatus = response.processSuccessAmount;
      let failStatus = response.processFailureAmount;
      let currentStatusArr = this.data.statusList;
     
      currentStatusArr.forEach((item,index) => {
        if(item.id == 0){
          item.text = '全部状态(' + allStatus + '条）'
        }
        if(item.id == 1){
          item.text = '状态为联系成功(' + successStatus + '条）'
        }
        if(item.id == 2){
          item.text = '状态为联系失败(' + failStatus + '条）'
        }
      })
      this.setData({statusList:currentStatusArr})
    })
  },


 
  showSelect(){
    var animationExpole = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease'
    });
    if(this.data.showSelectFlag){
      animationExpole.top('-220rpx').step();
    }else{
      animationExpole.top('80rpx').step();
    }
    this.setData({
      animation:animationExpole.export(),
      showSelectFlag:!this.data.showSelectFlag,

    })
  },
  viewProcess(e){
    console.log(e.currentTarget.dataset.index);
    wx.navigateTo({
      url:"/pages/personalInfo/myVisitProcess/myVisitProcess"
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})