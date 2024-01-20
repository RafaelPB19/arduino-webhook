import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
let lastSentence = '';

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);
    lastSentence = data.toString();
  });

  ws.send(lastSentence);
  lastSentence = '';
});