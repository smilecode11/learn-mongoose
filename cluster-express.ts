import cluster from 'cluster'
import { cpus } from 'os'
import process from 'process'
import express from 'express'

function startExpress() {
    const app = express()
    app.get('/api/slow', (_req, res) => {
        console.time('showApi');
        const baseNumber = 7;
        let result = 0;
        for (let i = Math.pow(baseNumber, 7); i >= 0; i--) {
            result += Math.tan(i) * Math.atan(i);
        }
        console.timeEnd('showApi');
        console.log(`Result number is　${result} - ON PROCESS ${process.pid}`);
        res.send(`Request number is ${result}`);

        //  在响应时, 发送消息
        process.send({ cmd: 'notify' })
    })
    app.listen(3000, () => {
        console.log(`App listening on port 3000`);
    })
}

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} running`)
    const cpLength = cpus().length
    console.log('cups core', cpus.length)
    let numReqs = 0;

    function messageHandler(msg) {
        if (msg.cmd && msg.cmd === 'notify') {
            numReqs += 1;
        }
    }
    setInterval(() => {
        console.log(`numReqs = ${numReqs}`);
    }, 1000)
    //  为每一个 cpu fork 一个对应的子进程
    for (let i = 0; i < cpLength; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`)
    })
    //  侦听各进程 - cluster.workers
    for (const id in cluster.workers) {
        cluster.workers[id].on('message', messageHandler);
    }
} else {
    //  被启动的交 Worker 进程, 顾名思义就是干活的 [工人]. 他们接收请求, 对外提供服务
    startExpress()
}