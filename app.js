const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");
const errorHandler = require("./middlewares/errorHandler");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://admin:testing123@cluster0.xqgocdg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then((res) => {
        console.log("Connection established successfully");
    })
    .catch((err) => {
        console.log("Error while establishing connection to mongodb");
    })


const apiLimiter = new rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", apiLimiter);

var corsOptions = {
  origin: process.env.URI || "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use("/api/v1/auth", cors(corsOptions), auth);
app.use("/api/v1/users", cors(corsOptions), user);
app.use("/api/v1/posts", cors(corsOptions), post);

app.use(errorHandler);

module.exports = { app };




