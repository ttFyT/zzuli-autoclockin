const readline = require('readline')

module.exports = {
  rl: null,
  init () {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  },
  async question (q, callback = () => { }) {
    return new Promise((resolve) => {
      rl.question(q, (input) => {
        callback(input)
        resolve(input)
      })
    })
  },
  close () {
    rl.close()
  }
}