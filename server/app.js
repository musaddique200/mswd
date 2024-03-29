const express = require("express");
const cors = require('cors');
const userRoutes = require("./routes/userRoutes");
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");

const app = express();
app.use(cors());

dbConnect();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/api", userRoutes);

app.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).send('Something broke!');
});

module.exports = app;
