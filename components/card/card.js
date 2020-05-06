// components/companyList/companyList.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    company: {
      type: Object,
    },
    schema: {
      type: String,
      value: "collect",
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    localImg: app.localImg,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //  编辑
    onEdit() {
      this.triggerEvent('onEdit');
    },
    // 收藏
    onCollect(e) {
      // this.company.id
      this.triggerEvent('onCollect');
    },
    titleImgErr(e) {
      let type = e.target.dataset.type
      this.triggerEvent('titleImgErr', {
        type: type
      });
    },
  },
})