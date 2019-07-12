const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
  // 先取出集合记录总数
  console.log("云函数获取数据")
  console.log(event)
  console.log(context)
  const search = {
    date:event.date,
    _openid: event.openid
  }
      
  console.log("查询条件")
  console.log(search)

  const countResult = await db.collection('counters').where(search).count()
  const total = countResult.total
  // 计算需分几次取
  const  batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('counters').where(search).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  if (batchTimes==0){
    const promise = db.collection('counters').where(search).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {

      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}