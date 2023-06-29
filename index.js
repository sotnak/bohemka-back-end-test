const express = require('express');
const bodyParser = require('body-parser');
const {processReq} = require("./src/process");
const {dbInsert} = require("./src/db");
const env = require("./src/env")

const app = express()

app.use(bodyParser.raw({type: 'multipart/form-data', limit:'200gb'}))
app.route('/file').post(async (req, res, next)=>{
    let obj;
    try {
        obj = await processReq(req)

        if (!obj || !obj.hash || !obj.size) {
            throw new Error("Something went wrong")
        }
    } catch (e){
        console.warn(e)
        next(e)
        return;
    }

    try {
        await dbInsert(obj.hash, obj.size)
    } catch (e) {
        console.warn(e)
        next(e)
        return;
    }

    const message = {hash: obj.hash, size: obj.size}
    console.log(message)

    res.send(message)
})

app.listen(env.port, ()=>{
    console.log(`listening on port ${env.port}`)
})