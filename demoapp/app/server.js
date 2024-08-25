let express = require('express');
let path = require('path');
let fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

app.get('/get-profile', function(req,res) {
  var response = res;

  console.log("in get profile");
  MongoClient.connect('mongodb://admin:password@mongodb:27017')
  .then((client)=>{
    var db = client.db('user-account');
    var query = {userid: 1};
    db.collection('users').findOne(query)
    .then((result)=>{
      client.close();
      if(!result){
        result={};
      }
      response.send(result);
    })
    .catch((err)=>{
      throw err;
    })
  })
  .catch((err)=>{
    throw err;
  });
});

app.post('/update-profile', function(req,res) {
  var userObj = req.body;
  var response = res;

  console.log('connecting to db ... ');
  MongoClient.connect('mongodb://admin:password@mongodb:27017')
  .then((client)=>{
    var db = client.db('user-account');
    userObj['userid']=1;
    var query = {userid: 1};
    var newValues = { $set: userObj};
    db.collection('users').updateOne(query, newValues, {upsert: true})
    .then((result)=>{
      console.log(' successfully updated or inserted');
      client.close();
      response.send(userObj);
    })
    .catch((err)=>{
      throw err;
    })
  })
  .catch((err)=>{
    throw err;
  });
})


app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
