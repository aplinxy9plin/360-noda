const uuid = require('uuid/v4');
const { root, modelPath } = require('~/config');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);
const Canvas = require('canvas');
const imgsz = require('image-size');

const clear = async files => {
    for (const f of files) {
        await unlink(f);
    }
}
const waitForStreamEnd = stream => {
    return new Promise((res, rej) => {
        stream.on('finish', () => {
            res();
        });      
    });

}

exports.fileExists = util.promisify(fs.access);

exports.createModel = async (files) => {
    if (!files.length) {
        await clear(files);
        return null;
    }

    try {
        const md = imgsz(files[0]);

        const mw = md.width;
        const mh = md.height;

        // const output = images(mw * files.length, mh);
        // let output = gm();

        const canvas = Canvas.createCanvas(mw * files.length, mh);
        const ctx = canvas.getContext('2d')

        let xo = 0;

        for (const f of files) {
            // output
            //     .in('-page', `+${xo}+0`)
            //     .in(f)

            const i = await Canvas.loadImage(f);
            ctx.drawImage(i, xo, 0, mw, mh);

            // output = output
            //     .append(f, true);


            // output
            //     .draw(images(f), xo, 0);
            xo += mw;
        }

        const id = `${mw}x${mh}x${files.length}--${uuid()}`;

        // output
        //     .write(`${root}/public/models/${id}.jpg`, function (err) {
        //         if (err) console.log(err);
        //         clear(files);
        //     });

        // get image
        const stream = canvas.createJPEGStream();
        const out = fs.createWriteStream(`${modelPath}/${id}.jpeg`);
        stream.pipe(out);
        await waitForStreamEnd(out);

        await clear(files);

        return id;
    } catch (e) {
        console.log('Error on merge', e);
        await clear(files);
        return null;
    }
};