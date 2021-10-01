const read = require('./utils/read')
const { fetchInfo, user, login, addAttributes, postToSever } = require('./user')
const { readSettings, readInfo } = require('./utils/file')

! async function () {
  console.log('[声明] 坚决拥护党的领导，听党话、跟党走，铭记党的初心和使命，以党为标杆和榜样，旗帜鲜明地永远跟党走;\n')
  console.log('[隐私] 根据豫教防疫办[2020]17号、郑教防疫办[2020]28号文件要求，您填报的内容将由学校上报至政府有关部门;\n')
  console.log('[注意] 本程序仅为方便每日打卡，在一切健康状态良好、位置不变情况下使用本程序自动填报，如有健康状态变更、位置移动等，请勿使用本程序;\n')
  console.log('[条约] 认真填报，若填报不正确信息，出现任何问题概不负责；若不接受，请关闭本程序;\n')
  read.init()
  console.log('读取配置文件...')
  let setting = JSON.parse(readSettings())
  // 接受一次写入配置，后续不再提示
  if (!setting.accepted) {
    await read.question('请确认已阅读并接受以上内容，接受(\'y\'): ', (input) => {
      if (input == 'y') setting.accepted = true
      else process.exit(1)
    })
  }
  // 已接受
  if (setting.code == null || setting.code == '') {
    // 若没有登录过
    await read.question('学号(\'12位学号\'): ', (id) => { setting.user_code = id })
    await read.question('密码: ', (password) => { setting.password = password })
    // 登录，获取传来的各种token
    let tokens = await login(setting.user_code, setting.password)
    setting.code = tokens.code
    let info = await fetchInfo(setting.code)
    if (setting.code) {
      console.log(`你好，${info.user_name}`)
      console.log(`学号: ${info.user_code}`)
      console.log(`身份证: ${info.id_card}`)
      console.log(`性别: ${info.sex}`)
      console.log(`年龄: ${info.age}`)
      console.log(`学院: ${info.org}`)
      console.log(`年级: ${info.year}`)
      console.log(`专业: ${info.spec}`)
      console.log(`班级: ${info.class}`)
      console.log(`目前居住详细地址: ${info.province}${info.city}${info.district}${info.address}\n`)

      await read.question('手机号: ', (i) => { info.mobile = i })
      await read.question('家长手机号: ', (i) => { info.jt_mobile = i })
      await read.question('输入所在省: ', (i) => { info.jz_province = i })
      await read.question('输入所在市/县: ', (i) => { info.jz_city = i })
      await read.question('输入所在区: ', (i) => { info.jz_district = i })
      await read.question('输入在i轻工大上定位所得结果: ', (i) => { info.jz_address = i })
      await read.question('以上输入的省、市、区，是否与i轻工大定位结果对应一致(\'y\'): ', (i) => {
        if (i == 'y') info.jz_sfyz = '是'
        else info.jz_sfyz = '否'
      })
      console.log('根据位置获取经纬度https://lbs.amap.com/demo/jsapi-v2/example/map/click-to-get-lnglat，必须与定位一致')
      await read.question('经纬度(\'如：113.508931,34.81148\',注意英文逗号): ', (input) => {
        info.lon = Number(input.substring(0, input.indexOf(',')))
        info.lat = Number(input.substring(input.indexOf(',') + 1, input.length))
        info.gcj_lon = info.lon
        info.gcj_lat = info.lat
      })

      await read.question('今日体温(正常\'y\'): ', (i) => {
        if (i != 'y')
          console.log('请到i轻工大填报！')
      })
      await read.question('有无新冠症状(无\'n\'): ', (i) => {
        if (i != 'n')
          console.log('请到i轻工大填报！')
      })
      await read.question('同住人员有无症状(无\'n\'): ', (i) => {
        if (i != 'n')
          console.log('请到i轻工大填报！')
      })
      await read.question('假期以来是否接触过确诊活疑似病例？是否被隔离过？(否\'n\'): ', (i) => {
        if (i != 'n')
          console.log('请到i轻工大填报！')
      })
      await read.question('你是否被确诊或疑似得过新冠？(否\'n\'): ', (i) => {
        if (i != 'n')
          console.log('请到i轻工大填报！')
      })
      await read.question('疫苗接种是否已完成？(未接种\'1\'，未完成\'2\'，已完成\'3\'): ', (i) => {
        switch (i) {
          case 2: info.jjymqk = '未完成接种'; break;
          case 3: info.jjymqk = '已完成接种'; break;
          default: info.jjymqk = '未接种'
        }
      })
      await read.question('7月22日以来核酸检测次数(\'0-99\'): ', (i) => {
        if (i <= 0) {
          info.hsjcqk = '未检测'
        } else if (i <= 6) {
          info.hsjcqk = `${i}次`
        } else info.hsjcqk = '更多次'
      })
      await read.question('最后一次检测时间，格式\'2021-08-02\'，无\'n\'): ', (i) => {
        if (i == 'n') {
          info.last_time = ""
        } else info.last_time = i
      })
      await read.question('所在地风险等级(低风险\'1\'，中风险\'2\'，高风险\'3\'): ', (i) => {
        switch (i) {
          case 2: info.fxdj = '中风险'; break;
          case 3: info.fxdj = '高风险'; break;
          default: info.fxdj = '低风险'
        }
      })
      await read.question('所在区域管理分类(正常\'1\'，封闭区\'2\'，封控区\'3\'): ', (i) => {
        switch (i) {
          case 2: info.flgl = '封闭区'; break;
          case 3: info.flgl = '封控区'; break;
          default: info.flgl = '正常'
        }
      })
      await read.question('健康码状态(绿码\'1\'，黄色\'2\'，红色\'3\'): ', (i) => {
        switch (i) {
          case 2: info.jkmzt = '黄色'; break;
          case 3: info.jkmzt = '红色'; break;
          default: info.jkmzt = '绿色'
        }
      })

      // 设置打卡时间
      await read.question('是否设置定时自动打卡？(\'y\'): ').then(async (input) => {
        if (input == 'y') {
          await read.question('设置打卡时间，小时(\'0-23\'): ', (input) => { setting.h = input })
          await read.question('设置打卡时间，分钟(\'0-59\'): ', (input) => { setting.m = input })
          console.log(`你的打卡时间为每天${setting.h}:${setting.m}`)
          console.log('监听中，可以最小化窗口，请勿关闭...')
        } else {
          // 立即打卡
          addAttributes(info)
          console.log(info)
          postToSever(tokens, readInfo())
        }
      })
    }
    else {
      console.log('登陆失败，建议截图提交issue')
    }
  }
  read.close()
}()