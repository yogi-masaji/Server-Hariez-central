require("dotenv").config();
const express = require("express");
const router = require("./routes/index");
var cors = require("cors");
const app = express();
const path = require("path");
const ErrorMiddlewares = require("./middlewares/ErrorMiddlewares");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use(ErrorMiddlewares);

const port = 3000;

app.listen(port, () => console.log(`server listening on port ${port}!`));

module.exports = app;
