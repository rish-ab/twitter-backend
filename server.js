var http = require('http');
var app = require('./app');

var server = http.createServer(app);

const validatePort = (val) => {
    if(isNaN(val)){
        console.log("Error while assigning Port");
        return process.exit(1);
    }
    return val;
};


const port = validatePort(process.env.port || 3000);

server.listen(port);