const axios = require('axios')
const crypto = require('crypto')
const config = require('./config.js')

const core = {
  isValid(word) {
    let chiniesePattern = new RegExp("[\\u4E00-\\u9FFF]+")
    let englishPattern = new RegExp("[A-Za-z]+")
    
    let isOk = false
    for(let char of word.split('')){
      let isChiniese = chiniesePattern.test(char)
      let isEnglish = englishPattern.test(char)
      if(isChiniese || isEnglish){
        isOk = true
      }else{
        isOk = false
      }
    }
    if (isOk) {
      return word
    } else {
      throw new Error('Invalid Input')
    }
  },
  language(word) {
    let chiniesePattern = new RegExp("[\\u4E00-\\u9FFF]+", "g")
    if (chiniesePattern.test(word)) {
      return 'zh'
    }
    let englishPattern = new RegExp("[A-Za-z]+")
    if (englishPattern.test(word)) {
      return 'en'
    }
    return 'other'
  },
  async request(word, from, to) {
    let salt = (new Date).getTime();
    let appid = config.id
    let key = config.key
    let api = config.api
    let sign = `${appid}${word}${salt}${key}`
    sign = crypto.createHash('md5').update(sign).digest('hex')

    let params = {
      q: word,
      appid: appid,
      salt: salt,
      from: from,
      to: to,
      sign: sign
    }
    let result = await axios.get(api, { params: params })
    if (result.data.error_code) {
      throw new Error(`${result.data.error_msg}`)
    } else {
      let output = []
      if (result.data.trans_result.length > 0) {
        let data = result.data.trans_result
        for (let item of data) {
          output.push(item.dst)
        }
      }
      return output
    }
  }
}

module.exports = core