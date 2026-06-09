const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('¡Entorno de desarrollo Escuchify funcionando en Docker!');
});

server.listen(3000, () => {
  console.log('Servidor de prueba corriendo en el puerto 3000');
});