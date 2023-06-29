const workerpool = require("workerpool")
const {removeBoundaries} = require("./boundaries");
const {reduceSize} = require("./sizeReducer");
const env = require("./env")

const poolOptions = {}
if(env.maxWorkers) poolOptions.maxWorkers = env.maxWorkers;
if(env.maxQueueSize) poolOptions.maxQueueSize = env.maxQueueSize;

const pool = workerpool.pool(__dirname + "/worker.js", poolOptions)

process.on('exit',async ()=>{ await pool.terminate(true)})
process.on('SIGINT',async ()=>{ await pool.terminate(true); process.exit()})

const processReq = async (req) => {
    const start = Date.now();
    //console.log(pool.stats())

    let data = removeBoundaries(req.body, req.headers)
    const length = data.length
    data = reduceSize(data, env.targetSize)
    data = Buffer.from(data)

    const prepEnd = Date.now()

    //console.log(data.length)

    const hash = await pool.exec("hashWorker", [data])

    const end = Date.now();
    console.log(`Execution time: ${end - start} ms, Preparation time: ${prepEnd - start} ms, Hash time: ${end - prepEnd} ms`);

    return {hash: hash, size: length}
}

module.exports.processReq = processReq