// pages/email/outDemandCard/components/recommendCompanies.js
const req_fn = require("../../../../utils/route");
const util = require("../../../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    localImg: app.localImg,
    imagePath: req_fn.imagePath,
    companyLists: [],
    companyIds: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(companyId) {
      wx.showLoading({
        title: "加载中..."
      });
      req_fn
        .req(`/api/company/${companyId}/mailbox-recommend-companies`, {
          companyId: companyId
        }, "post")
        .then(res => {
          if (res.code == 0) {
            if (res.data != null) {
              let companyIds = ''
              res.data.forEach(element => {
                if (element.logo) {
                  element.logo = element.logo.replace(/\s/g, '')
                }
                if (element.logoUrl) {
                  element.logoUrl = element.logoUrl.replace(/\s/g, '')
                }
                if (element.logo && element.logo.indexOf("http") == -1) {
                  element.logo = req_fn.imgUrl + element.logo;
                }
                element.rename = util.getCompanName(element.name)
                companyIds = companyIds + element.id
                element.checked = true
              });
              this.setData({
                companyLists: res.data
              })
              this.initChecked()
              // 数据可以调
              this.triggerEvent('toRecommend', true);
            }
          } else {
            // 数据可以调
            this.triggerEvent('toRecommend', false);
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();

        });
    },
    // 切换选中
    onRecommendChecked(e) {
      let index = e.detail.index
      this.data.companyLists[index].checked = !this.data.companyLists[index].checked
      this.setData({
        companyLists: this.data.companyLists
      })
      this.initChecked()
    },
    // 处理选中
    initChecked() {
      let companyLists = this.data.companyLists
      let companyIds = ''
      companyLists.forEach(item => {
        if (item.checked) {
          companyIds = companyIds + (companyIds ? ',' : '') + item.id
        }
      })
      this.data.companyIds = companyIds
    },
    // 一件投递
    allSumbit() {
      this.triggerEvent('allSumbit', this.data.companyIds);
    },
    // 图片加载失败
    titleImgErr(e) {
      //console.log(e.detail.index);
      let companyLists = this.data.companyLists
      companyLists[e.detail.index].logoUrl = null
      this.setData({
        companyLists: companyLists
      })
    }, // 需求名片详情
    onChangeCompanyPage(e) {
      this.onRecommendChecked(e)
    }
  }
})