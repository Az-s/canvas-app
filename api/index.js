const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app  = express();

require('express-ws')(app);

const port = 8000;

app.use(cors());

const activeConnections = {};

app.ws('/drawer', (ws, req) => {
    const id = nanoid();
    console.log(`Conncted! ${id}`);

    activeConnections[id] = ws;
    console.log(activeConnections);

    ws.on('draw', msg => {
        const decoder = JSON.parse(msg);

        switch (decoder.type) {
            case 'CREATE_DRAW':
            Object.keys(activeConnections).forEach(key => {
                const connection = activeConnections[key];

                connection.send(JSON.stringify({
                    type: 'NEW_DRAW',
                    draw: decoder.draw,
                }))
            }); 
            break;
            default: 
                console.log('Unknown type:' , decoder.type);
        }
    });

    ws.on('close', () => {
        console.log(`Disconnetcted! ${id}`);
        delete activeConnections[id];
        console.log(activeConnections);
    });

    // ws.on('message', (msg) => {
    //     msg = JSON.parse(msg);
    //     switch (msg.method) {
    //         case "connection":
    //             connectionHandler(ws, msg);
    //             break;
    //         case "draw":
    //             broadcastConnection(ws, msg);
    //             break;
    //     }
    // })
});

// app.post('/image', (req, res) => {
//     try {
//         const data = req.body.img.replace(`data:image/png;base64,`, '');
//         fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64');
//         return res.status(200).json({ message: "Загружено" });
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json('error');
//     }
// })
// app.get('/image', (req, res) => {
//     try {
//         const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`));
//         const data = `data:image/png;base64,` + file.toString('base64');
//         res.json(data);
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json('error');
//     }
// })

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});

// const connectionHandler = (ws, msg) => {
//     ws.id = msg.id
//     // ws.id = nanoid();
//     broadcastConnection(ws, msg);
// }