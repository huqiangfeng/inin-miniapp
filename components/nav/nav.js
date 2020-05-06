// components/nav/nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navList: Array,
    defaultNav: String,
    isCut: Boolean,
    navStyle: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    nav: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeNav(e) {
      this.setData({
        nav: e.currentTarget.dataset.tab
      })
      this.triggerEvent('checkde', e.currentTarget.dataset.tab);
    }
  },
  // 组件生命周期
  lifetimes: {
    // 在组件实例进入页面节点树时执行
    attached() {},
    //在组件在视图层布局完成后执行
    ready() {
      this.setData({
        nav: this.properties.defaultNav ? this.properties.defaultNav : this.properties.navList[0].value
      })
      //console.log(this.properties.navStyle);
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