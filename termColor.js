const chalk = require('chalk')

exports.WARNING = (value) => chalk.bold.yellowBright(`[!] ${value}`)
exports.SUCCESS = (value) => chalk.greenBright(`[+] ${value}`)
exports.ERROR = (value) => chalk.bold.redBright(`[-] ${value}`)
exports.INFO = (value) => chalk.blueBright(`[i] ${value}`)
exports.QUERY = (value) => chalk.cyanBright(`[?] ${value}`)
