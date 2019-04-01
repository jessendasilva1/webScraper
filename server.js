require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cheerio = require("cheerio");
const db = require('./models');

const app = express();
var PORT = process.env.PORT || 4000;

// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        partialsDir: __dirname + "/views/partials/"
    })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webScraperDB";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

module.exports = app;