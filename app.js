//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb+srv://@cluster0-pbvgw.mongodb.net/todolistdb",{useNewUrlParser:true,useUnifinedTopology:true});
const itemSchema=new mongoose.Schema({
  name: String
});
const listSchema={
  name:String,
  items:[itemSchema]
};
const Item=mongoose.model("Item",itemSchema);
const Workl=mongoose.model("Workl",itemSchema);
const List=mongoose.model("list",listSchema);
var today=new Date();

var options={
  weekday:'long',
  month:'long',
  day:"numeric",
  year:"numeric"
};
const it1=new Item({
  name:"BUY FOOD"
});
const it2=new Item({
  name:"COOK FOOD"
});
var day=today.toLocaleDateString("en-us",options);

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){

  Item.find(function(err,results){
    if(results.length===0){
      Item.insertMany([it1,it2],function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("successfully added to database");
        }
        res.redirect("/");
      });
    }
    if(err){
    console.log(err);
    }
    else{
      res.render('index',{title:"TODAY",items:results});
  }
  });
});
app.get("/:title",function(req,res){
  const listName=req.params.title;
  List.findOne({name:listName},function(err,result){
  if(!result){
  const Newlist= new List({
    name:listName,
    items:[]
  });
  Newlist.save();
  res.redirect("/"+listName);
}
else{
  res.render("index",{title:result.name,items:result.items});
}
});
});
app.get("/about",function(req,res){
  res.render("about",{title:"ABOUT"});
});

app.post("/",function(req,res){
  var title=req.body.list;
  var item=req.body.item;
  const it = new Item({
        name: item
      });
  if(title==="TODAY")
  {
    it.save();
    res.redirect("/");
  }
  else
  {
    List.findOne({name:title},function(err,result){
      result.items.push(it);
      result.save();
      res.redirect("/"+title);
    });
  }
});
app.post("/delete",function(req,res){
  id=req.body.checkBox;
  title=req.body.listName;
  if(title==="TODAY"){
  Item.findByIdAndDelete(id,function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("success");
      res.redirect("/");
    }
  });
}
else{
  List.findOneAndUpdate({name:title},{$pull:{items:{_id:id}}},function(err,result){
    result.save();
    res.redirect("/"+title);
  });
}
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
