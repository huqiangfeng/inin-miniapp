// components/sidebar/sidebar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeKey: {
      type: Number,
      value: 0
    },
    list: Array
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    change(e) {
      let index = e.currentTarget.dataset.index
      this.triggerEvent('change', index);
    }
  },
  // 组件生命周期
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {

    },
    //在组件在视图层布局完成后执行
    ready() {

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