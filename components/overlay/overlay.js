// components/overlay/overlay.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    on_tap() {
      this.triggerEvent('tap');
    },
    on_touchmove() {
      // 阻止事件传播
    }
  }
})