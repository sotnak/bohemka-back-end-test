const workerpool = require("workerpool")
const crypto = require("crypto")

const hashBuffers = (buffers)=>{
    let data = []

    for(const buff of buffers){
        data.push(...buff)
    }

    data = Buffer.from(data)

    const sha1 = crypto.createHash('sha1')
    try {
        sha1.update(data)
    } catch (e) {
        console.warn(e)
        throw new Error(e)
    }

    return sha1.digest('hex')
}

const hashStrings = (strs) => {
    const str = strs.join("")

    const sha1 = crypto.createHash('sha1')
    try {
        sha1.update(str)
    } catch (e) {
        console.warn(e)
        throw new Error(e)
    }

    return sha1.digest('hex')
}

workerpool.worker({
    hashBuffers: hashBuffers,
    hashStrings: hashStrings
})