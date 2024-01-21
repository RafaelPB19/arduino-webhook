import { WebSocketServer } from 'ws';
import { networkInterfaces } from 'os';

const wss = new WebSocketServer({ port: 8080 });
let lastSentence = '';

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}
console.log('ℹ️ IP:', results);

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    lastSentence = data.toString();
  });

  ws.send(lastSentence);
  lastSentence = '';
});

console.log('✅ Server initialized')