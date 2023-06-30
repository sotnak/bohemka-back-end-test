require("dotenv").config()

console.log(process.env)

const env = {
    maxWorkers: process.env.MAX_WORKERS ? Number(process.env.MAX_WORKERS) : undefined,
    maxQueueSize: process.env.MAX_QUEUESIZE ? Number(process.env.MAX_QUEUESIZE) : undefined,
    chunkSize: process.env.CHUNK_SIZE ? Number(process.env.CHUNK_SIZE) : 16777216
}

module.exports = env