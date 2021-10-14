const { postToSever, addAttributes, login } = require("./functions/user")
const CryptoJS = require("./utils/crypto-js")

!async function () {
  let username, password, wj_type, info, tokens
  username = process.argv[process.argv.indexOf('--username') + 1]
  password = process.argv[process.argv.indexOf('--password') + 1]
  wj_type = process.argv[process.argv.indexOf('--type') + 1]
  info = process.argv[process.argv.indexOf('--data') + 1]
  let decrypted = CryptoJS.enc.Base64.parse(info).toString(CryptoJS.enc.Utf8)
  info = JSON.parse(decrypted)
  if (wj_type == 1) {
    console.log('[在校晨检]')
  }
  else if (wj_type == 0) {
    console.log('[居家填报]')
  } else {
    console.log('无效的填报类型！')
    return;
  }
  tokens = await login(username, password)
  addAttributes(info, wj_type)

  // 时区处理
  let offset_GMT = new Date().getTimezoneOffset();
  let nowDate = new Date().getTime();
  let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + 8 * 60 * 60 * 1000);
  targetDate = targetDate.getFullYear()+'-'+targetDate.getMonth()+'-'+targetDate.getDate()
  if (targetDate.substring(targetDate.indexOf('-') + 1, targetDate.lastIndexOf('-')).length == 1) {
    targetDate = targetDate.replace('-', '-0')
  }
  if (targetDate.substring(targetDate.lastIndexOf('-') + 1, targetDate.length).length == 1) {
    targetDate = targetDate.slice(0, targetDate.length - 1) + '0' + targetDate.charAt(targetDate.length - 1)
  }
  info.date = targetDate

  postToSever(tokens, info)
}()