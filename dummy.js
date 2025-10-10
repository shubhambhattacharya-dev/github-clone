const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Dummy server on 5000');
});
server.listen(5000, () => console.log('Dummy server listening on 5000'));
