const pg = require("pg")
require("dotenv").config()

const dbInsert = async (hash, size) => {
    const client = new pg.Client()
    await client.connect()
    await client.query("INSERT INTO FILE_HASH (hash, size) VALUES ($1, $2)",[hash, size])
    await client.end()
}

module.exports.dbInsert = dbInsert