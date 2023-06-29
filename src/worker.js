const workerpool = require("workerpool")
const crypto = require("crypto")

const hashWorker = (data)=>{
    const sha1 = crypto.createHash('sha1')
    try {
        sha1.update(data)
    } catch (e) {
        console.warn(e)
        throw new Error(e)
    }

    return sha1.digest('hex')
}

workerpool.worker({
    hashWorker: hashWorker
})