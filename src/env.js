require("dotenv").config()

console.log(process.env)

const env = {
    targetSize: process.env.MAX_SIZE_TO_HASH ? Number(process.env.MAX_SIZE_TO_HASH) : undefined,
    maxWorkers: process.env.MAX_WORKERS ? Number(process.env.MAX_WORKERS) : undefined,
    maxQueueSize: process.env.MAX_QUEUESIZE ? Number(process.env.MAX_QUEUESIZE) : undefined,
}

module.exports = env