import mongoose from 'mongoose'
import config from 'config-lite'
import chalk from 'chalk'

mongoose.connect(config.url)
mongoose.Promise = global.Promise

const db = mongoose.connection

db.once('open', () => {
    console.log(chalk.green('数据库连接成功'))
})
db.on('error', (err) => {
    console.log(chalk.red('数据库连接失败，失败原因：' + err))
})
db.on('close', () => {
    console.log(chalk.red('数据库断开。正在尝试重新连接...'))
    mongoose.connect(config.url, {server: {auto_reconnect:true}})
})

export default db