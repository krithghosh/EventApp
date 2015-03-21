var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var mongo = require('mongodb');
var bodyParser = require('body-parser');

var app = express();
//app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

var userSchema = new mongoose.Schema({
  eventname : { type: String, required: true },
  eventcity:String,
  eventdate:Date,
  eventdetails:String
});

var User = mongoose.model('events',userSchema);

app.get('/getDetails',function(req,res){
    //mongoose.connect('mongodb://127.0.0.1:27017/EventMngDatabase',function(error){
      mongoose.connect('mongodb://krithghosh:mercury29@ds041841.mongolab.com:41841/eventmanagedb',function(error){
      if(error)
        {
          console.log(error);
        }

        console.log("Connected to the database");
      
        if(req.query.date!=null)
        {
            var date = req.query.date;
            var customdate = date.substring(0,4).concat("-").concat(date.substring(4,6).concat("-").concat(date.substring(6,8)));
            var eventdate = new Date(customdate).toISOString();
            console.log(eventdate);
        }

        if(req.query.city!=null)
        {
            var eventcity = req.query.city;
        }
        
        if(eventcity!=null && eventdate!=null)
        {
            User.find({"eventdate": eventdate,"eventcity":eventcity},function(err,body){
                      res.json(body);
                      });
        }
        else{
              if(eventdate!=null)
              {
                  User.find({"eventdate": eventdate},function(err,body){
                            res.json(body);
                            });
              }

              if(eventcity!=null)
              {
                  User.find({"eventcity":eventcity},function(err,body){
                            res.json(body);
                            });
              }
            }
           });
});

  app.post('/putDetails',function(req,res){
    //mongoose.connect('mongodb://127.0.0.1:27017/EventMngDatabase',function(error){
      mongoose.connect('mongodb://krithghosh:mercury29@ds041841.mongolab.com:41841/eventmanagedb',function(error){
      if(error)
        {
          console.log(error);
        }
    
    var name = req.body.eventname;
    var city = req.body.eventcity;
    var date  = req.body.eventdate;
    var details  = req.body.eventdetails;
    
    var customdate = date.substring(0,4).concat("-").concat(date.substring(4,6).concat("-").concat(date.substring(6,8)));
    var eventdate = new Date(customdate).toISOString();
    //res.send(eventdate);
   
    var document = new User({eventname:name,eventcity:city,eventdate: new Date(eventdate),eventdetails:details});

    document.save(function (err) {
      if (err) 
      {
        res.send(err);
      }
      else 
      {
        res.send("document inserted");
      }
          });
      });
  });

  app.get('/deleteItem',function(req,res){
    mongoose.connect('mongodb://127.0.0.1:27017/EventMngDatabase',function(error){
      if(error)
        {
          console.log(error);
        }

    var id = req.query.id;
    User.remove({"_id":id},function(error){
      res.send("Deleted");
      });
    });
  });

module.exports = app;