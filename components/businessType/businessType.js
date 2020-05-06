// components/businessType/businessType.js
const req_fn = require("../../utils/route");
const util = require("../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    transmit: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    localImg: app.localImg,
    list: [{
      name: '电子商务'
    }],
    checkeds: [] //默认选中不限
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 换一换
    on_change() {
      //console.log('换一换');
    },
    // 确认
    on_confirm() {
      //console.log('确认');
      this.triggerEvent('confirm', this.data.checkeds);
    }, // 不限
    on_unlimited() {
      this.initList()
    },
    // 选中item
    on_checkedItem(e) {
      this.initList(e.currentTarget.dataset.index)
    },
    // 处理选择数据
    initList(i) {
      let list = this.data.list
      let checkeds = this.data.checkeds
      if (i || i == 0) {
        list[i].checked = true
        checkeds.push(list[i].name)
      } else {
        list.forEach(element => {
          element.checked = false
        })
        checkeds = []
      }
      this.setData({
        list: list,
        checkeds: checkeds
      })
    }
  },
  // 组件生命周期
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {},
    //在组件在视图层布局完成后执行
    ready() {
      if (this.properties.transmit) {
        let arr = [...Array(26)].map(_ => {
          return {
            name: '手动阀收',
            checked: false
          }
        })
        this.setData({
          list: arr
        })
      }
    },
    // 在组件实例被移动到节点树另一个位置时执行
    moved() {},
    // 在组件实例被从页面节点树移除时执行
    detached() {

    },
    // 每当组件方法抛出错误时执行
    error() {

    }
  },
})