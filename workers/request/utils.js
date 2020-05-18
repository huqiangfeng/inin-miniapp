// 设置时间格式化
function setListDate(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].data[list[i].data.length - 1].day = getDate(list[i].data[list[i].data.length - 1].time);
  }
  return list
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
module.exports = {
  setListDate
}