const express = require('express');
const busboy = require("connect-busboy");
const {processReq} = require("./src/process");
const {dbInsert} = require("./src/db");

const app = express()
const port = 8080

app.use(busboy({
    immediate: true,
    limits: {
        fileSize: 200 * 1024 * 1024 * 1024,
    }}))

app.route('/file').post((req, res, next)=>{
    const start = Date.now();
    if (req.busboy) {
        req.busboy.on('file', (name, file, info) => {
            const hashPromises = []
            let length = 0;

            file.on('data', (chunk) => {
                length+=chunk.length
                hashPromises.push(processReq(chunk))
            })
            file.on('close',async ()=>{
                let hashes = await Promise.all(hashPromises)
                hashes = hashes.join("")

                let hash
                try {
                    hash = await processReq(Buffer.from(hashes))
                    await dbInsert(hash, length)
                } catch (e) {
                    next(e)
                    console.warn(e)
                    return;
                }

                const end = Date.now();

                console.log(`Execution time: ${end - start} ms`);
                console.log({hash, size: length})
                res.send({hash, size: length})
            })
        });
    }
})

app.listen(port, ()=>{
    console.log(`listening on port ${port}`)
})