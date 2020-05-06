// components/region/region.js
const req_fn = require("../../utils/route");
const util = require("../../utils/util");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: Boolean,
    transmit: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    localImg: app.localImg,
    activeKey: 0,
    list: [],
    autoLocation: '',
    checked: null,
    nav: '100000',
    navList: [{
      name: '国内',
      value: '100000'
    }, {
      name: '国外',
      value: '0'
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // <!-- nav切换 -->
    changeNav(e) {
      this.setData({
        nav: e.detail
      })
      // 获取省份
      this.getProvinceList()

    },
    // 确认
    on_affirm(e) {
      this.triggerEvent('checked', this.data.autoLocation);
    },
    // 省份切换
    on_changeSidebar(e, actioveId) {
      let index = e.detail
      this.setData({
        activeKey: index
      })
      if (!this.data.list[index].citys) {
        this.getCityList(this.data.list[index].id, index, actioveId)
      } else {
        this.actioveItem(this.data.list[index].citys, actioveId)
      }
    },
    // 选中
    on_checked(e) {
      let index = e.currentTarget.dataset.index
      this.filtrate()
      this.data.list[this.data.activeKey].citys[index].checked = true
      this.setData({
        list: this.data.list
      })
      this.triggerEvent('checked', this.data.list[this.data.activeKey].citys[index]);
    },
    // 搜索
    on_search(value) {
      this.getSearchList(value).then(res => {
        //console.log(res)
        if (res.code === 0 && res.data.length > 0) {
          let item = res.data[0]
          if (item.level === 1) {
            this.actioveItem(this.data.list, item.id)
            this.setData({
              activeKey: 0,
              list: this.data.list
            })
            this.on_changeSidebar({
              detail: this.activeKey
            })
          } else if (item.level === 2) {
            this.actioveItem(this.data.list, item.parentId)
            this.setData({
              activeKey: 0,
              list: this.data.list
            })
            this.on_changeSidebar({
              detail: this.data.activeKey
            }, item.id)
          }

        }
      })
    },
    // 高亮
    actioveItem(list, id) {
      let index
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          index = i
        }
      }
      if (index > 0) {
        let actioveItem = list.splice(index, 1)
        list.unshift(actioveItem[0])
      }


    },
    // 搜索城市
    getSearchList(name) {
      return new Promise((resolve, reject) => {
        req_fn
          .req('area/search', {
            name: name
          }, "get").then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
      })
    },
    // 获取省份
    getProvinceList() {
      let _this = this
      req_fn
        .req('area/' + this.data.nav, {
          parentId: this.data.nav
        }, "get").then(res => {
          _this.setData({
            list: res.data
          })
          _this.getCityList(res.data[0].id, 0)
        })
    },
    // 获取城市
    getCityList(id, index, actioveId) {
      let _this = this
      req_fn
        .req(`area/${id}`, {
          parentId: id
        }, "get").then(res => {
          _this.actioveItem(res.data, actioveId)
          _this.data.list[index].citys = res.data
          _this.setData({
            list: _this.data.list
          })
        })
    },
    // 定位获取位置
    getlocation() {
      let _this = this
      wx.getLocation({
        type: 'wgs84',
        success(data) {
          req_fn
            .req(`/public/city`, {
              location: `${data.longitude},${data.latitude}`
            }, "get").then(res => {
              let data = {
                id: res.data.cityId,
                name: res.data.cityName
              }
              _this.setData({
                autoLocation: data
              })
            })
        }
      })
      // 异步操作
    },
    // 筛选去重
    filtrate() {
      this.data.list.forEach(element => {
        if (element.citys) {
          element.citys.forEach(item => {
            item.checked = false
          })
        }
      })
      this.setData({
        checked: null,
        list: this.data.list
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
        // 定位
        this.getlocation()
        // 获取省份
        this.getProvinceList()
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