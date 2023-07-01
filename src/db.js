const pg = require("pg")
require("dotenv").config()

const dbInsert = async (hash, size, execution_time) => {
    const client = new pg.Client()
    await client.connect()
    await client.query("INSERT INTO FILE_HASH (hash, size, execution_time) VALUES ($1, $2, $3)",[hash, size, execution_time])
    await client.end()
}

module.exports.dbInsert = dbInsert