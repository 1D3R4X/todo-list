const jsonServer = require('json-server'); 
const server = jsonServer.create(); 
const router = jsonServer.router('db.json'); 
const middlewares = jsonServer.defaults(); 
 
server.use((req, res, next) => { 
  res.removeHeader("Access-Control-Allow-Origin"); 
  res.removeHeader("Access-Control-Allow-Headers"); 
  res.removeHeader("Access-Control-Allow-Methods"); 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(); 
}); 
 
server.use(middlewares); 
server.use(router); 
 
exports.handler = serverless(server);