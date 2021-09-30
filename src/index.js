const read = require('./utils/read')
const { fetchInfo, user, login } = require('./user')

! async function () {
  console.log('[声明] 坚决拥护党的领导，听党话、跟党走，铭记党的初心和使命，以党为标杆和榜样，旗帜鲜明地永远跟党走;\n')
  console.log('[隐私] 根据豫教防疫办[2020]17号、郑教防疫办[2020]28号文件要求，您填报的内容将上报至政府有关部门，并仅用于疫情防控;\n')
  console.log('[注意] 本程序仅为方便每日打卡，在一切健康状态良好、位置不变情况下使用本程序自动填报，如有健康状态变更、位置移动等，请勿使用本程序;\n')
  console.log('[条约] 认真填报，若填报不正确信息，出现任何问题概不负责；若不接受，请关闭本程序;\n')
  read.init()
  await read.question('请确认已阅读并接受以上内容，确认(\'y\'): ')
  // 读取配置
  console.log('读取配置文件...')



  // 若没有配置
  await read.question('设置打卡时间，小时(\'0-23\'): ')
  await read.question('设置打卡时间，分钟(\'0-59\'): ')
  // console.log(`你的打卡时间为每天${setting.time}，确认(\'y\'): `)
  await read.question('学号(\'12位学号\'): ', (id) => { user.user_code = id })
  await read.question('密码: ', (password) => { user.password = password })
  login(user.user_code, user.password, async (code) => {
    if (code) console.log('登录成功')
    user.user_name = (await fetchInfo(code)).user_name
    console.log(`你好，${user.user_name}`)
  })
  /*
  await read.question('姓名: ')
  await read.question('身份证号: ')
  await read.question('性别(\'男|女\'): ')
  await read.question('年龄(\'17-99\'): ')
  await read.question('入学年份(\'20xx\'): ')
  await read.question('专业(\'软件工程\'): ')
  await read.question('班级(\'软件工程21-01\'，无空格): ')
  await read.question('手机号: ')
  await read.question('家长手机号: ')
  await read.question('所在省份(\'河南省\'): ')
  await read.question('所在市(\'郑州市\'): ')
  await read.question('所在区(\'中原区\'): ')
  await read.question('所在住址(\'科学大道136号 8#-702\'): ')
  console.log('所在住址经纬度查询https://lbs.amap.com/demo/jsapi-v2/example/geocoder/regeocoding，必须与现住址一直，不可谎报')
  await read.question('经纬度(\'如：113.508931,34.81148\',英文逗号): ')
  await read.question('经纬度(\'如：113.508931,34.81148\'): ')
  */
  read.close()
}()