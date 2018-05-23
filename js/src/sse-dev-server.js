const express = require('express');
const app = express();
const router = express.Router();


router.get('/test', (req, res) => {

    console.log("Client connected");
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    let intv = setInterval(() => {
        console.log("Sending data");
        res.write('id: ' + (new Date()).toLocaleTimeString() + '\n');
        res.write('data:  ' + JSON.stringify({line1: 'some data here'}) +'\n\n');
    }, 5000);

    res.socket.on('close', () => {
        console.log("Client disconnected");
        clearInterval(intv);
    })
});

router.options('/test', (req, res) => {
    console.log("OPTIONS requested");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Aceess-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS');
    res.status(200);
});

app.use(express.json());
app.use('/', router);

app.listen(8080, () => {
    console.log("Listening on 8080");
});

