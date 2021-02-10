const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDb",{useNewUrlParser: true,useUnifiedTopology:true});

const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})

.post(function(req,res){
  const newArticle = new Article ({
    title:req.body.title,
  content: req.body.content
});
newArticle.save(function(err){
  if(!err){
    res.send("successfully posted");
  }
 });
})

.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("success");
    }else{
      res.send(err);
    }
  });
});

//===================================================================================================================================================//

app.route("/articles/:articleTitle")

.get(function(req,res){
  const userPreference = req.params.articleTitle;
  Article.findOne({title:userPreference},function(err,foundArticle){
    if(!err){
      res.send(foundArticle);
    }else{
      res.send(err);
    }
  });
})

.put(function(req,res){
  Article.update({title:req.params.articleTitle},
                  {title:req.body.title,content:req.body.content},
                  {overwrite:true},
                function(err){
                  if(!err){
                    res.send("successfully edited");
                  }
                });
})

.patch(function(req,res){
  Article.update({title:req.params.articleTitle},
                  {$set: req.body},
                function(err){
                  if(!err){
                    res.send("Successfully patched");
                  }else{
                    res.send(err);
                  }
                });
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},
                    function(err){
                      if(!err){
                        res.send("Succesfully Deleted");
                      }else{
                        res.send(err);
                      }
                    });
});


app.listen(3000,function(req,res){
  console.log("server started succesfully");
});
