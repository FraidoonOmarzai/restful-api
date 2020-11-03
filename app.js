const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(express.static("public"));
app.set("view engine", 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB", {
   useNewUrlParser: true,
   useUnifiedTopology: true
});

const articleSchema = {
   title: String,
   content: String
};

const Article = mongoose.model("Article", articleSchema);

////////////////////// requst targeting all articles/////////////////////

app.route("/articles")
   .get((req, res) => {
      Article.find((err, foundItems) => {
         if (!err) {
            res.send(foundItems);
         } else {
            res.send(err);
         }
      });
   })
   .post((req, res) => {

      const newArticle = new Article({
         title: req.body.title,
         content: req.body.content
      });

      newArticle.save(err => {
         if (!err) {
            res.send("successfully added");
         } else {
            res.send(err);
         }
      });
   })
   .delete((req, res) => {
      Article.deleteMany(err => {
         if (!err) {
            res.send("successfully deleted all!");
         } else {
            res.send(err);
         }
      });
   });

////////////////////// requst targeting specific article /////////////////

app.route("/articles/:articleTitle")
   .get((req, res) => {
      Article.findOne({
         title: req.params.articleTitle
      }, (err, foundArticle) => {
         if (foundArticle) {
            res.send(foundArticle);
         } else {
            res.send("not found matching!");
         }
      });
   })
   .put((req, res) => {
      Article.update({
            title: req.params.articleTitle
         }, {
            title: req.body.title,
            content: req.body.content
         }, {
            overwrite: true
         },
         err => {
            if (!err) {
               res.send("successfully updated");
            } else {
               res.send(err);
            }
         }
      );
   })
   .patch((req, res) => {
      Article.update({
            title: req.params.articleTitle
         }, {
            $set: req.body
         },
         err => {
            if (!err) {
               res.send("successfully updated.");
            } else {
               res.send(err);
            }
         }
      );
   })
   .delete((req, res) => {
      Article.deleteOne({
            title: req.params.articleTitle
         },
         err => {
            if (!err) {
               res.send("successfully deleted.");
            } else {
               res.send(err);
            }
         }
      );
   });

app.listen(3000, () => {
   console.log("running on port 3000");
});
