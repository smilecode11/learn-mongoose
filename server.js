const express = require('express')

function startExpress() {
    const app = express()
    app.get('/api/slow', (_req, res) => {
        res.send({ cmd: 'notify' })
    })
    app.get('/', (req, res) => {
        res.send({ msg: 'hello world' })
    })
    app.listen(3000, () => {
        console.log(`App listening on port 3000`);
    })
}

startExpress()