var http = require('http');
const {app} = require("./app");

var server = http.createServer(app);

const validatePort = (val) => {
    if(isNaN(val)){
        console.log("Error while assigning Port");
        return process.exit(1);
    }
    return val;
};


const port = validatePort(process.env.port || 5000);

server.listen(port,console.log(`server started at port ${port}`));