const express = require("express");
const server = express();
const cors = require("cors");
require("dotenv/config");
var port = process.env.PORT || 8080;
var mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

//parse json
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//import Api Routes
const booksRoute = require("./routes/api/books");
server.use("/api/books", booksRoute);

const authorRoute = require("./routes/auth");
server.use("/api/author", authorRoute);

server.get("/", (req, res) => {
  res.send("Books api");
});

server.listen(port, () => {
  console.log('Server is running on port: ' + port);
});
