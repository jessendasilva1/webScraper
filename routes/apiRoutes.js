//let db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/", function(req, res) {
    axios
      .get(
        "https://www.newegg.ca/Gaming-Desktops/SubCategory/ID-3742?Tid=897450"
      )
      .then(res => {
        //let results = [];
        let $ = cheerio.load(res.data);
        $("div.item-container").each(function(index, element) {
          let link = $(element)
            .children()
            .attr("href");
          console.log(link);
        });
      })
      .catch(err => {
        console.log(err);
      });
    res.render("index");
  });

  //The 404 Route (ALWAYS Keep this as the last route)
  app.get("*", function(req, res) {
    res.render("404");
  });
};
