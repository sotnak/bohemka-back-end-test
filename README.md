## Back-End Test
HTTP API in Node.js with a single file upload POST route /file.
The file is transported as part of multipart/form-data.

Both asynchronous and parallel approach is used.
I/O operations are handled asynchronously by master worker.
CPU heavy operations (Buffer preparation and hash calculation) are handled by workers from pool.

This API is connected to PostgreSQL.
Both the database and the API can be started by ``docker compose up -d``.
The first time the database is started, the FILE_HASH table is created.
Duplicate records are allowed.

---
API is configurable through environment variables.
- PGHOST - postgres host
- PGPORT - postgres port
- PGUSER - postgres user
- PGPASSWORD - postgres password
- MAX_WORKERS - maximum of workers in pool
- MAX_QUEUESIZE - maximum of requests in queue
- MAX_SIZE_TO_HASH - maximum size of buffer to hash
---
