// personalInfo//setInfoInput/setInfoInput.js
const req_fn = require("../../../utils/route");
const util = require("../../../utils/util");
const app = getApp();
let phoneTimeout
Page({

  /**
   * 页面的初始数据
   */

  data: {
    localImg: app.localImg,
    oldInput: "",
    inputData: "",
    maxLength: 10,
    type: "",
    tip: "",
    title: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let inputData, oldInput, type, tip, title, maxLength
    if (options.input == "null" || options.input == null) this.inputData = "";
    else inputData = options.input;
    oldInput = inputData;
    // pages/mine/peopleInfo/home/main
    type = options.type;
    switch (options.type) {
      case "name": {
        tip = "输入姓名";
        title = "姓名";
        maxLength = 10;
        break;
      }
      case "positionName": {
        tip = "输入职位";
        title = "公司职位";
        maxLength = 10;
        break;
      }
      case "weixin": {
        tip = "输入微信";
        title = "微信号";
        maxLength = 20;
        break;
      }
    }

    this.setData({
      inputData: inputData,
      oldInput: oldInput,
      type: type,
      tip: tip,
      title: title,
      maxLength: maxLength
    })
  },
  // 双向绑定value值
  onChangeValue(e) {
    let value = e.detail.value
    if (value === this.data.inputData) {
      return
    }
    this.data.inputData = value
    clearTimeout(phoneTimeout)
    phoneTimeout = setTimeout(() => {
      this.setData({
        inputData: this.data.inputData
      })
    }, 300);
    // this.setData({
    //   inputData: e.detail.value
    // })
  },
  // 保存
  sumbit() {
    let data = {};
    //console.log(this.data.type)
    if (this.data.inputData != "") {
      switch (this.data.type) {
        case "name": {
          data = {
            name: this.data.inputData
          };
          break;
        }
        case "positionName": {
          data = {
            positionName: this.data.inputData
          };
          break;
        }
        case "weixin": {
          // var wxreg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/

          // if (!wxreg.test(this.data.inputData)) {
          //   wx.showToast({
          //     title: "请输入正确的微信号",
          //     icon: "none",
          //     duration: 2000
          //   });
          //   return
          // }
          data = {
            weixin: this.data.inputData
          };
          break;
        }
      }
      req_fn.req("api/user/update", data, "post").then(res => {
        if (res.code == 0) {
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        }
      });
    }
  },
  // 返回上一页
  back() {
    if (this.data.inputData != "" && this.data.oldInput != this.data.inputData) {
      wx.showModal({
        content: "信息还未保存是否退出",
        cancelText: "退出",
        cancelColor: "#1882F1",
        confirmText: "保存",
        confirmColor: "#1882F1",
        success(res) {
          if (res.confirm) {
            this.sumbit();
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            });
          }
        }
      });
    } else {
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      });
    }
  },
  // 清空输入框
  empty() {

    this.setData({
      inputData: ""
    })
  }
})