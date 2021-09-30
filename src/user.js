const { getUserInfo, msg_xsc } = require("./api/config")
const https = require('https')
const http = require('http')

exports.user = {
  user_name: null,
  user_code: null,
  password: null
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

// 登录获取打卡code
exports.login = (id, password, callback) => {
  let page = ''
  let lt, excution
  let JSESSIONID, client
  // 第一步请求
  // 获得 lt, excution, JSESSIONID, client
  let date = new Date().toLocaleDateString().replace(/\//g, '-')
  http.get(msg_xsc + date, (res) => {
    res.on('data', (chunk) => {
      page += chunk
    })
    res.on('end', () => {
      lt = page.substring(page.indexOf('LT-'), page.indexOf('-jinghua') + 8)
      excution = page.substring(page.indexOf(`execution" value="`) + 18, page.indexOf('value="e') + 11)
      JSESSIONID = res.rawHeaders[9].substring(res.rawHeaders[9].indexOf('=') + 1, res.rawHeaders[9].indexOf(';'))
      client = res.rawHeaders[21].substring(res.rawHeaders[21].indexOf('=') + 1, res.rawHeaders[21].indexOf(';'))
      console.log(res.rawHeaders[9]) // JSESSIONID
      console.log(res.rawHeaders[21]) // client

      // 第二步请求
      // 获得 CASTGC, location
      let CASTGC, location
      let content = `username=${id}&password=${password}&lt=${lt}&execution=${excution}&_eventId=submit`
      const reqCASTGC = http.request(msg_xsc + date, {
        method: 'POST',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'zh-CN,zh;q=0.9',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': content.length,
          'Cookie': `client=${client};JSESSIONID=${JSESSIONID};username=null;password=null`,
          'Host': 'kys.zzuli.edu.cn',
          'Origin': 'http://kys.zzuli.edu.cn',
          'Pragma': 'no-cache',
          'Referer': msg_xsc + date,
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 12.0; Pixel 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Mobile Safari/537.36'
        }
      }, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          CASTGC = res.headers['set-cookie'][1].substring(7, res.headers['set-cookie'][1].indexOf(';'))
          console.log(CASTGC)
          location = res.headers.location
          console.log(location)

          // 第三步请求
          // 获得PHPSESSID, location
          let PHPSESSID
          http.get(location, (res) => {
            let data = ''
            res.on('data', (chunk) => {
              data += chunk
            })
            res.on('end', () => {
              PHPSESSID = res.headers['set-cookie'][1].substring(10, res.headers['set-cookie'][1].indexOf(';'))
              location = res.headers.location
              console.log(PHPSESSID)
              console.log(res.headers.location)

              // 第四步请求
              // 获得 location, 从location中提取标识码
              http.get(location, {
                headers: {
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                  'Accept-Encoding': 'gzip, deflate, br',
                  'Accept-Language': 'zh-CN,zh;q=0.9',
                  'Cache-Control': 'no-cache',
                  'Cookie': `PHPSESSID=${PHPSESSID}`,
                  'Host': 'msg.zzuli.edu.cn',
                  'Proxy-Connection': 'keep-alive',
                  'Referer': 'http://kys.zzuli.edu.cn/',
                  'Pragma': 'no-cache',
                  'Upgrade-Insecure-Requests': '1',
                  'User-Agent': 'Mozilla/5.0 (Linux; Android 12.0; Pixel 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Mobile Safari/537.36'
                }
              }, (res) => {
                let data = ''
                res.on('data', (chunk) => {
                  data += chunk
                })
                res.on('end', () => {
                  let code = res.rawHeaders[13].substring(res.rawHeaders[13].indexOf('code=') + 5, res.rawHeaders[13].length)
                  console.log(code)
                  callback(code)
                })
              })
            })
          })
        })
      })
      reqCASTGC.write(content)
      reqCASTGC.end()
    })
  })
}