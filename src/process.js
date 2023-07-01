const workerpool = require("workerpool")
const env = require("./env")

const poolOptions = {}
if(env.maxWorkers) poolOptions.maxWorkers = env.maxWorkers;
if(env.maxQueueSize) poolOptions.maxQueueSize = env.maxQueueSize;

const pool = workerpool.pool(__dirname + "/worker.js", poolOptions)

process.on('exit',async ()=>{ await pool.terminate(true)})
process.on('SIGINT',async ()=>{ await pool.terminate(true); process.exit()})

const processBuffers = async (buffers) => {
    return await pool.exec("hashBuffers", [buffers])
}

const processHashes = async (hashes) => {
    return await pool.exec("hashStrings", [hashes])
}

module.exports.processBuffers = processBuffers
module.exports.processHashes = processHashes