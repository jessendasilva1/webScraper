require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
//var cheerio = require("cheerio");
//var db = require("./models");

var app = express();
var PORT = process.env.PORT || 4000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webScraperDB";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(err => {
    console.log("Not Connected to Database ERROR! ", err);
  });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

module.exports = app;
