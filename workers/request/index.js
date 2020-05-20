const utils = require('./utils')


worker.onMessage((msg) => {
  console.log(msg);
  let msgList = msg.msgList // 聊天数据
  let value = msg.value // 查询条件
  let lists = msgList.filter(element => {
    let dataArr = element.data
    let countArr = [] // 符合条件的条数
    for (const item of dataArr) {
      let flg = false
      if (item.type === 'emoji' || item.type === 'txt') {
        let textArr = item.text
        for (const chatItem of textArr) {
          if (chatItem.type === 'txt') {
            if (filtrate(value, chatItem.data)) {
              flg = true
            }
          }
        }
      }
      if (flg) {
        countArr.push(item)
      }
    }
    if (countArr.length > 0) {
      element.data = countArr
    }
    return countArr.length > 0
  });
  worker.postMessage(lists)
  worker.terminate()
})

function filtrate(val, txt) {
  return txt.includes(val)
}