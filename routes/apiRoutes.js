let db = require("../models");
const axios = require('axios');

module.exports = function (app) {
    app.get('/', function(req, res) {
        res.send("hello");
    })
        /*
        axios.get("/")
            .then((res) => {
                res.send("hello from root");
            })
            .catch((err) => {
                console.log(err);
            })
            */
}