const http = require("http");
const PORT = process.env.PORT || 3010;

const app = require("../app");
const log = require('../utils/log');

const server = http.createServer(app);

server.listen(PORT, function(){
  log("server is running on port: " + PORT)
})