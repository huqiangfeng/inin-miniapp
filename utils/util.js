// 工具箱
function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
/**
 * 时间格式化
 * @param {date/dataStr} date
 * @param {boolean} hasYear
 * @return '2019-09-09 00:00'
 */
function formatTime(date, hasYear = false, hasSecond = false) {
  if (date == null) return ''
  date = new Date(date)
  const nowYear = new Date().getFullYear()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  let t1
  if (nowYear == year) {
    t1 = [month, day].map(formatNumber).join('-')
  } else {
    t1 = [year, month, day].map(formatNumber).join('-')
  }
  if (hasYear) {
    t1 = [year, month, day].map(formatNumber).join('-')
  }

  const t2 = [hour, minute].map(formatNumber).join(':')

  if (hasSecond) {
    return `${t1} ${t2}`
  } else {
    return year + '年' + month + '月' + day + '日'
  }

}

function getDate(time) {
  let d = new Date(time),
    n = new Date().getTime() - time
  if (n / 1000 / 60 / 60 / 24 > 2) {
    let m = d.getMonth() + 1,
      day = d.getDate()
    if (m < 10) m = '0' + m
    if (day < 10) day = '0' + day
    return m + '-' + day
  } else if (n / 1000 / 60 / 60 / 24 > 1) {
    return '昨天'
  } else {
    return [d.getHours(), d.getMinutes()].map(formatNumber).join(':')
  }
}
/**
 * 获取文件大小
 * @param {*} size
 */
function fileSize(size) {
  // size - bit
  if (size / 1024 < 1024) {
    return (size / 1024).toFixed(1).replace('.0', '') + 'K'
  } else if (size / 1048576 < 1024) {
    return (size / 1048576).toFixed(1).replace('.0', '') + 'M'
  } else {
    return (size / 1073741824).toFixed(1).replace('.0', '') + 'M'
  }
}

function suffixName(name) {
  return name.replace(/.+\./, '').toUpperCase()
}

function pattern(str, type) {
  let rule
  switch (type) {
    case 'email': {
      rule = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      break
    }
    case 'phone': {
      rule = /^[1]([3-9])[0-9]{9}$/
      break
    }
    case 'img': {
      rule = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
      break
    }
  }

  return rule.test(str)
}
// 设置小程序本地存储
function setLocal(key, value) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: value,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
// 获取小程序本地存储
function getLocal(key) {
  var value = wx.getStorageSync(key)
  if (value != '') {
    return value
  } else return false
}
// 删除本地存储
function clearLocal(key) {
  wx.removeStorage({
    key: key,
    success(res) {
      return res
    },
    fail(err) {
      return false
    }
  })
}
// 判断登录
function isLogin() {
  return getLocal('Login')
}
// 判断登录绑定公司
function hasCompanyName() {
  return getLocal('companyName')
}
// 是否去登录
function modalIsLogin(title = '请登录', content = '登录后可查看，前往登录？') {
  wx.showModal({
    title: title,
    content: content,
    cancelText: '暂不登录',
    cancelColor: '#1882F1',
    confirmText: '立即登录',
    confirmColor: '#1882F1',
    success(res) {
      if (res.confirm) {
        getApp().pageIndex = logoToPage()
        wx.navigateTo({
          url: '/pages/home/login/login'
        })
      }
    }
  })
}
// 格式化公司名字
function getCompanName(companyName) {
  if (!companyName) {
    companyName = ''
    return companyName
  } else if (companyName.length <= 4) {
    companyName = companyName
    return companyName
  } else if (companyName.indexOf('省') >= 0) {
    companyName =
      companyName.substring(0, companyName.indexOf('省')) +
      companyName.substring(companyName.indexOf('省') + 1)
    //    print("0-3===省》${companyName}");
    return getCompanName(companyName)
  } else if (companyName.indexOf('（') >= 0) {
    companyName =
      companyName.substring(0, companyName.indexOf('（')) +
      companyName.substring(companyName.indexOf('（') + 1)
    //    print("0-3===省》${companyName}");
    return getCompanName(companyName)
  } else if (companyName.indexOf('）') >= 0) {
    companyName =
      companyName.substring(0, companyName.indexOf('）')) +
      companyName.substring(companyName.indexOf('）') + 1)
    //    print("0-3===省》${companyName}");
    return getCompanName(companyName)
  } else if (companyName.indexOf('市') >= 0) {
    companyName =
      companyName.substring(0, companyName.indexOf('市')) +
      companyName.substring(companyName.indexOf('市') + 1)
    //    print("0-3===市》${companyName}");
    return getCompanName(companyName)
  } else if (companyName.indexOf('区') >= 0) {
    companyName =
      companyName.substring(0, companyName.indexOf('区')) +
      companyName.substring(companyName.indexOf('区') + 1)
    //    print("0-3===区》${companyName}");
    return getCompanName(companyName)
  } else if (companyName.indexOf('县') >= 0) {
    companyName =
      companyName.substring(0, companyName.indexOf('县')) +
      companyName.substring(companyName.indexOf('县') + 1)
    //    print("0-3===县》${companyName}");
    return getCompanName(companyName)
  } else if (companyName.indexOf('镇') >= 0) {
    companyName =
      companyName.substring(0, companyName.indexOf('镇')) +
      companyName.substring(companyName.indexOf('镇') + 1)
    //    print("0-3===镇》${companyName}");
    return getCompanName(companyName)
  } else if (companyName.indexOf('乡') >= 0) {
    companyName =
      companyName.substring(0, companyName.indexOf('乡')) +
      companyName.substring(companyName.indexOf('乡') + 1)
    //    print("0-3===乡》${companyName}");
    return getCompanName(companyName)
  }
  //  print("0-3===》${companyName}");
  return companyName.substring(0, 4)
}

function logoToPage() {
  let pages = getCurrentPages()
  let url =
    '/' +
    pages[pages.length - 1].__displayReporter.route +
    '?' +
    pages[pages.length - 1].__displayReporter.showOptions.query
  return url
}
// 计算当前和传入的时间差
function timeDifference(paramsTime) {
  let currentTiem = new Date().getTime();
  let tiemDiff = Number(currentTiem) - Number(paramsTime); //传入的时间 - 当前的时间
  if (tiemDiff <= 86400000) {
    let remainder = parseInt(tiemDiff / 1000 / 60 / 60)
    return remainder + '小时前发布'
  } else if (tiemDiff > 86400000) {
    let remainder = parseInt(tiemDiff / 1000 / 60 / 60 / 24)
    return remainder + '天前发布'
  }
}

module.exports = {
  logoToPage: logoToPage,
  getCompanName: getCompanName,
  modalIsLogin: modalIsLogin,
  isLogin: isLogin,
  formatNumber: formatNumber,
  formatTime: formatTime,
  getDate: getDate,
  fileSize: fileSize,
  suffixName: suffixName,
  setLocal: setLocal,
  getLocal: getLocal,
  clearLocal: clearLocal,
  pattern: pattern,
  hasCompanyName: hasCompanyName,
  timeDifference: timeDifference
}