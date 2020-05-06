 // pages/loginTel/loginTel.js


 const util = require("../../../utils/util");
 const req_fn = require("../../../utils/route");
 const app = getApp();
 let captchaTimeout, phoneTimeout;
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     // 手机号
     imagePath: req_fn.imagePath,
     phone: "",
     countryCodes: ["+86", "+80", "+84", "+87"],
     countryCodesIndex: 0,
     localImg: app.localImg, // icon图标地址
     //验证码
     timer: 60,
     captcha: "",
     agreed: true,
     url: app.pageIndex //首页
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
     if (options.url) {
       this.setData({
         url: options.url
       });
     }
   },

   // 获取验证码
   onTapGetAuthCode() {
     if (this.data.phone != "" && util.pattern(this.data.phone, "phone")) {
       if (this.data.timer == 60) {
         req_fn
           .req("/captcha", {
             phone: this.data.phone,
             type: "reg"
           }, "post")
           .then(res => {
             if (res.code == 0)
               wx.showToast({
                 title: "发送成功",
                 icon: 'none',
                 duration: 1500
               });
             else
               wx.showToast({
                 title: res.msg,
                 icon: "none",
                 duration: 2000
               });
           });
         var timeClear = setInterval(() => {
           this.setData({
             timer: --this.data.timer
           })
           if (this.data.timer == 0) {
             clearInterval(timeClear);
             this.setData({
               timer: 60
             })
           }
         }, 1000);
       }
     } else {
       wx.showToast({
         title: "请填入正确的手机号",
         icon: "none",
         duration: 2000
       });
     }
   },
   //绑定
   sumbit() {
     if (
       this.data.phone != "" && this.data.agreed &&
       this.data.captcha != "" &&
       util.pattern(this.data.phone, "phone")
     ) {
       wx.login({
         success: data => {
           req_fn
             .req(
               "/account/miniweixin/bind-phone", {
                 phone: this.data.phone,
                 captcha: this.data.captcha,
                 code: data.code
               },
               "post"
             )
             .then(res => {
               if (res.code == 0) {
                 // 跳转页面
                 this.getCode()
               } else {
                 wx.showToast({
                   title: res.msg,
                   icon: "none",
                   duration: 2000
                 });
               }
             });
         }
       });
     }
   },
   //  手机区号+86 
   onChangecountryCodes(e) {
     this.setData({
       countryCodesIndex: e.detail.value
     })
   },
   //  手机号变化
   onInputPhone(e) {
     clearTimeout(phoneTimeout)
     phoneTimeout = setTimeout(() => {
       this.setData({
         phone: e.detail.value
       })
     }, 300);

   },
   //  验证码变化
   onInputCaptcha(e) {
     clearTimeout(captchaTimeout)
     captchaTimeout = setTimeout(() => {
       this.setData({
         captcha: e.detail.value
       })
     }, 300);
   },
   // 切换图片
   onTopsSwitchoverIcon() {
     this.setData({
       agreed: !this.data.agreed
     })

   },
   // 跳转登录协议
   changePageToLoginProtocol() {
     wx.navigateTo({
       url: '/pages/home/LoginProtocol/LoginProtocol'
     });
   },
   // 登录成功跳转页面
   successToPage() {
     // 判断是否已绑定公司
     req_fn
       .req("api/user/init-status", {}, "post")
       .then(res => {
         if (res.data.savedUserCard) {
           // 记录公司绑定
           util.setLocal("companyName", true)
           // 已绑定公司
           if (this.data.url) {
             // 开启im链接
             app.conn.open();
             wx.reLaunch({
               url: this.data.url
             });
           } else {
             wx.reLaunch({
               url: '/pages/home/email/email'
             });
           }
         } else {
           wx.reLaunch({
             url: "/pages/home/companyName/companyName"
           });
         }
       })
       .catch(err => {
         wx.reLaunch({
           url: "/pages/home/companyName/companyName"
         });
       });
   },
   // 登录
   getCode() {
     req_fn
       .getToken()
       .then(res => {
         // 登录完成跳转页面
         this.successToPage()
       })
       .catch(err => {
         this.setData({
           impower: true
         })
       });
   },
 })