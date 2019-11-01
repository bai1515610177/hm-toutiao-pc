// 导出一个本地操作用户信息的模块（设置用户，获取用户，清除用户）
const KEY = 'hm-toutiao-pc-user-key'
const local = {
  setUser (user) {
    // user是一个对象
    // 存储setItem（key，value） key将来获取时候需要使用 value是json格式的字符串
    const jsonStr = JSON.stringify(user)
    window.sessionStorage.setItem(KEY, jsonStr)
  },
  getUser () {
    const jsonStr = window.sessionStorage.getItem(KEY)
    return JSON.parse(jsonStr)
  },
  delUser () {
    window.sessionStorage.removeItem(KEY)
    // clear()清除所有的数据，不建议使用
    // setItem(KEY,'')
  }
}
export default local
