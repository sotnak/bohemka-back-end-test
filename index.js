const express = require('express');
const busboy = require("connect-busboy");
const {processReq} = require("./src/process");
const {dbInsert} = require("./src/db");
const ChunkBuffer = require("./src/ChunkBuffer");

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
        req.busboy.on('file', (_, file) => {
            const hashPromises = []
            let length = 0;
            const chunkBuffer = new ChunkBuffer(16 * 1024 * 1024)

            file.on('data', (chunk) => {
                length+=chunk.length
                chunkBuffer.push(chunk)

                //check if enough data to hash
                const buffered = chunkBuffer.getIfOverflown()
                if(buffered) hashPromises.push(processReq(buffered))
            })
            file.on('close',async ()=>{
                //hash rest of the file
                const buffered = chunkBuffer.finish()
                if(buffered) hashPromises.push(processReq(buffered))

                let hashes = await Promise.all(hashPromises)
                hashes = hashes.join("")

                //hash all hashes
                const hash = await processReq(Buffer.from(hashes))

                try {
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