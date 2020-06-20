import chalk from 'chalk'

export const WARNING = value => chalk.bold.yellowBright(`[!] ${value}`)
export const SUCCESS = value => chalk.greenBright(`[+] ${value}`)
export const ERROR = value => chalk.bold.redBright(`[-] ${value}`)
export const INFO = value => chalk.bold.blueBright(`[i] ${value}`)
export const QUERY = value => chalk.cyanBright(`[?] ${value}`)
