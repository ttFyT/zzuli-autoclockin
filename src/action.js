const { postToSever, addAttributes, login } = require("./functions/user")
const CryptoJS = require("./utils/crypto-js")

!async function () {
  let username, password, wj_type, info, tokens
  username = process.argv[process.argv.indexOf('--username') + 1]
  password = process.argv[process.argv.indexOf('--password') + 1]
  wj_type = process.argv[process.argv.indexOf('--type') + 1]
  info = process.argv[process.argv.indexOf('--data') + 1]
  console.log(process.argv)
  let decrypted = CryptoJS.enc.Base64.parse(info).toString(CryptoJS.enc.Utf8)
  console.log(decrypted)
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
  postToSever(tokens, info)
}()