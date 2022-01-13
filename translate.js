const { Command } = require('commander')
const chalk = require('chalk')
const core = require('./core.js')

const main = async () => {
  try{
    const Program = new Command()
    Program.command('from')
      .argument("<word>", "translate this word", core.isValid)
      .action(async (word) => {
        let result = []
        if (core.language(word) === 'zh') {
          result = await core.request(word, 'zh', 'en')
        }
        if (core.language(word) === 'en') {
          result = await core.request(word, 'en', 'zh')
        }
        for(let item of result){
          console.log(chalk.cyan.bold(item))
        } 
      })
    await Program.parseAsync()
  }catch(error){
    console.error(chalk.red.bold(error.message))
  }
}

main()