// requiring express
var express = require("express");
// requiring mongoose
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// is working on localhost3000
const PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios

  axios.get("https://stackoverflow.com/").then(function (response) {

   
    var $ = cheerio.load(response.data);

    // An empty array to save the data that we'll scrape
    var result = {};

    
    $("a.question-hyperlink").each(function (i, element) {

      result.title = $(this).text();
      result.link = $(this).attr("href");


      // Create a new Question using the `result` object built from scraping
      db.Question.create(result)
        .then(function (dbQuestion) {
          // View the added result in the console
          console.log(dbQuestion);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });


      // If we were able to successfully scrape and save an Question, send a message to the client
      res.send("Hey!!! You were able to sucessfully scrape!!!");
    });
  });
});

// Route for getting all Questions from the db
app.get("/Questions", function (req, res) {
  // Grab every document in the Questions collection
  db.Question.find({})
    .then(function (dbQuestion) {
      // If we were able to successfully find Questions, send them back to the client
      res.json(dbQuestion);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


app.get("/Questions/:id", function (req, res) {
  
  db.Question.findOne({
      _id: req.params.id
    })
    
    .populate("note")
    .then(function (dbQuestion) {
   
      res.json(dbQuestion);
    })
    .catch(function (err) {
      
      res.json(err);
    });
});


app.post("/Questions/:id", function (req, res) {
  
  db.Note.create(req.body)
    .then(function (dbNote) {
   
      return db.Question.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    })
    .then(function (dbQuestion) {
    
      res.json(dbQuestion);
    })
    .catch(function (err) {
      
      res.json(err);
    });
});


app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});