// components/companyList/companyList.js
const app = getApp();
let phoneTimeout;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: '',
    },
    search_title: {
      type: String,
      value: '',
    },
    placeholder: {
      type: String,
      value: '请输入',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    isShowCancelBtn: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    localImg: app.localImg,
    publicValue: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 点击input
    onTapInput() {
      this.triggerEvent('onTapInput');
    },
    // 点击搜索图标
    onSearch() {
      this.triggerEvent('onSearch');
    },
    // 点击清除图标
    onClear(e) {
      this.setData({
        publicValue: ''
      })
      this.triggerEvent('onClear');
    },
    // 双向绑定value值
    onChangeValue(e) {
      let value = e.detail.value
      if (value === this.data.value) {
        return
      }
      clearTimeout(phoneTimeout)
      phoneTimeout = setTimeout(() => {
        this.setData({
          publicValue: value
        })
        this.triggerEvent('onChangeValue', value);
      }, 300);

    },
    // 点击取消按钮
    onCancelBtn(e) {
      this.triggerEvent('onCancelBtn');
    },
  },
  // 组件生命周期
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {
      this.setData({
        publicValue: this.properties.value
      })
    }
  },
})