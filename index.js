const express = require('express');
const busboy = require("connect-busboy");
const {processBuffers, processHashes} = require("./src/process");
const {dbInsert} = require("./src/db");
const ChunkBuffer = require("./src/ChunkBuffer");
const env = require("./src/env");

const app = express()
const port = 8080

app.use(busboy({
    immediate: true,
    limits: {
        fileSize: 200 * 1024 * 1024 * 1024,
    },
}))

app.route('/file').post((req, res, next)=>{
    const start = Date.now();
    if (req.busboy) {
        req.busboy.on('file', (_, file) => {
            const hashPromises = []
            let length = 0;
            const chunkBuffer = new ChunkBuffer(env.chunkSize)

            const hashFun = (buff)=>{hashPromises.push(processBuffers(buff))}

            file.on('data', (chunk) => {
                length+=chunk.length
                chunkBuffer.push(chunk)

                chunkBuffer.runIfOverflown(hashFun)
            })
            file.on('close',async ()=>{
                //hash rest of the file
                let overflown = true;
                while(overflown){
                    overflown = chunkBuffer.runIfOverflown(hashFun)
                }
                chunkBuffer.finish(hashFun)

                let hashes = await Promise.all(hashPromises)

                //hash all hashes
                const hash = await processHashes(Buffer.from(hashes))

                const end = Date.now();

                const execTime = end - start;

                try {
                    await dbInsert(hash, length, execTime)
                } catch (e) {
                    next(e)
                    console.warn(e)
                    return;
                }

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