const { getUserInfo } = require("./api/config")
const https = require('https')
const CryptoJS = require('./utils/crypto-js')

exports.user = {
  user_code: null
}

exports.fetchInfo = async (code) => {
  let data = ''
  return new Promise((resolve) => {
    https.get(`${getUserInfo}code=${code}&wj_type=0`, (res) => {
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', resolve)
    })
  }).then(() => {
    console.log(data)
    return JSON.parse(data)
  })
}

exports.getEncryptedUserCode = (str) => {
  let key = CryptoJS.enc.Utf8.parse('1234567887654321')
  let encrypted = CryptoJS.AES.encrypt(str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  }).toString()
  return encodeURIComponent(encrypted)
}
