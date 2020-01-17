const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const goods = require('./routes/goods')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(cors({
  origin:"http://192.168.14.33:8080",
  credentials:true
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use( async(ctx,next)=>{
  // 登录才可以访问后端其他的端口
  if(ctx.cookies.get("userId")){
    await next()
  }else{
    // 没有登录的情况后端有些接口是可以访问的
    if(ctx.path =="/users/login" || ctx.path=="/goods/list" || ctx.path =="/user/Logout"){
      await next()
    }else{
      ctx.body={
        code:1001,
        msg:"未登录"
      }
    }
  }
  console.log("1")
})
// routes
app.use(goods.routes(), goods.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
