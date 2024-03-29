
const http = require('http');
const app = require('./app');

app.set('port', 5000);
const server = http.createServer(app);

server.listen(5000);
