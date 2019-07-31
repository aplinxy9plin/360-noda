const Koa = require('koa');
const { root, port, env, ip } = require('~/config');
const router = require('./router');
const http = require('http');

const app = new Koa();

const pug = new (require('koa-pug'))({
    app,
    viewPath: `${root}/templates/`,
    noCache: (env === 'development')
});

app
    .use(require('koa-static')(`${root}/public/`, {
        defer: false,
        maxage: 1000 * 60 * 60 * 24
    }))
    .use(async (ctx, next) => {
        const b = Date.now();
        await next();
        const a = new Date();
        console.log(ctx.method, ctx.url, ctx.status, ((a.getTime() - b)) + 'ms');
    })
    .use(router.routes())
    .use(router.allowedMethods());

const httpServer = http.createServer(app.callback());
httpServer.listen(port, ip, () => {
    console.log('HTTP Server running on port', port);
});

