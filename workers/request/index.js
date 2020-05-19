const utils = require('./utils')


worker.onMessage((msg) => {
  console.log(msg);
  let msgList = msg.msgList // 聊天数据
  let value = msg.value // 查询条件
  let list = [] // 筛选完的列表
  msgList.filter(element => {
    let arr = element.data
    let count = 0 // 符合条件的条数 
    for (const item of arr) {
      if (item.type === 'emoji') {

      }
    }
  });
  worker.postMessage(list)
})