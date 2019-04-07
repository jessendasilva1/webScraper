//let db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");
// Require all models
const db = require("../models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Article.find().then(function(results) {
      res.render("index", {
        results: results
      });
    });
  });

  app.get("/scrape", function(req, res) {
    let promises = [];
    axios
      .get(
        //https://www.newegg.ca/Gaming-Desktops/SubCategory/ID-3742?Tid=897450
        "https://www.newegg.ca/Gaming-Desktops/SubCategory/ID-3742?Tid=897450"
      )
      .then(res => {
        let $ = cheerio.load(res.data);
        $("div.item-container").each(function(index, element) {
          return new Promise(resolve => {
            let link = $(element)
              .children(".item-img")
              .attr("href");
            let title = $(element)
              .children(".item-info")
              .children(".item-title")
              .text();
            let priceWhole = $(element)
              .find(".price-current")
              .children("strong")
              .text();
            let priceDecimal = $(element)
              .find(".price-current")
              .children("sup")
              .text();
            let price = priceWhole + priceDecimal;
            price = parseFloat(price.replace(/[/,]+/g, ""));
            let photo = $(element)
              .find(".item-img")
              .children("img")
              .attr("src");
            //console.log(title);
            //console.log(link);
            //console.log(price);
            //console.log(photo);
            db.Article.create({
              title: title,
              price: price,
              link: link,
              photo: photo
            })
              .then(dbEntry => {
                resolve(dbEntry);
              })
              .catch(() => {
                console.log("db duplicate");
              });
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
    Promise.all(promises).then(() => {
      res.redirect("/");
    });
  });

  app.post("/comments", function(req, res) {
    let params = req.body.id;
    let comment;
    db.Article.findOne({ _id: params })
      .populate("Comment")
      .then(function(dbArticle) {
        console.log(dbArticle);
        let result = {
          title: dbArticle.title,
          price: dbArticle.price,
          link: dbArticle.link,
          photo: dbArticle.photo
        };
        if (!dbArticle.comments) {
          comment = [];
        } else {
          comment = {
            comments: dbArticle.comments
          };
        }
        /* 
          this does not render for some reason. I store the mongo id on the button so i know which item im clicking on. I grab the associated 
          comments for that product and populate it on the page. The biggest hurdle with handlebars in the page refreshes. At this point, 
          hand coding each of the pages is much quicker even though it may take more time. 

          Everything should work in theory as expected aside from it not rendering to the page correctly. 
        */
        res.render("index", {
          results: result,
          comments: comment
        });
      });
  });

  app.post("/postComment", function(req, res) {
    console.log("postCommnet api " + JSON.stringify(req.body));
    let dataID = req.body.id;
    let title = req.body.title;
    let commentBody = req.body.commentBody;
    db.Comment.create({
      title: title,
      body: commentBody
    })
      .then(dbComment => {
        return db.Article.findOneAndUpdate(
          { _id: dataID },
          { $push: { comments: dbComment._id } },
          { new: true }
        );
      })
      .then(() => {
        res.redirect("/");
      });
  });

  //The 404 Route (ALWAYS Keep this as the last route)
  app.get("*", function(req, res) {
    res.render("404");
  });
};
