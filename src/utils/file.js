const fs = require('fs')
const path = require('path')

exports.readSettings = () => {
  return fs.readFileSync(path.join(__dirname, '../json/setting.json'), 'utf-8')
}

exports.writeSettings = (data, callback) => {
  fs.writeFile(path.join(__dirname, '../json/setting.json'), data, 'utf-8', callback)
}

exports.readInfo = () => {
  return fs.readFileSync(path.join(__dirname, '../json/info.json'), 'utf-8')
}

exports.writeInfo = (data, callback) => {
  fs.writeFile(path.join(__dirname, '../json/info.json'), data, 'utf-8', callback)
}