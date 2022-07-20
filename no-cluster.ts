import express from 'express';
const app = express();

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
})

app.listen(3000, () => {
    console.log(`App listening on port 3000`);
})