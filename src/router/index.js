const Router = require('koa-router');
const fs = require('fs');
const { root, modelPath } = require('~/config');
const asyncBusboy = require('async-busboy');
const { createModel, fileExists } = require('~/utils');

const router = new Router();

const _tmp = `${root}/tmp`;


router
    // страница загрузки изображений
    .get(['/', '/new'],
        async ctx => {
            ctx.render('new');
        })
    // обработка загрузки
    .post('/upload',
        async ctx => {
            const files = [];

            await asyncBusboy(ctx.req, {
                onFile: function (fieldname, file, filename, enc, mime) {
                    // save to tmp
                    const filepath = `${_tmp}/${filename}`;
                    files.push(filepath);
                    file.pipe(fs.createWriteStream(filepath));
                }
            });

            const modelId = await createModel(files);
            if (modelId) {
                ctx.redirect(`/model/${modelId}`);
            } else {
                ctx.redirect('/');
            }
        })
    // страница результата
    .get('/model/:id',
        async ctx => {
            const { id } = ctx.params;

            try {
                await fileExists(`${modelPath}/${id}.jpeg`, fs.F_OK);
            } catch(e) {
                ctx.redirect('/');
                return;
            }

            // get params
            const m = id.match(/(\d+)x(\d+)x(\d+)--.*/);

            ctx.render('model', {
                mw: m[1],
                mh: m[2],
                count: m[3],
                id,
                link: ctx.request.href,
            });
        });

module.exports = router;