const express = require('express');
const mongodb = require('mongodb');
const sanite = require('sanitize-html');
const app = express();

const port = 3000;
let db;
app.use(express.static('public'));


let url ='mongodb://localhost:27017/ToDoApp';


mongodb.connect(url, {useNewUrlParser:true, useUnifiedTopology: true }, (err,client)=>{
    db=client.db();
    app.listen(port);
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Access protection

/*function protection(req, res, next){
    res.set('WWW-Authenticate', 'Basic realm = "TODO_APP"');

    if(req.headers.authorization == "Basic Y29kZTpjb2Rpbmc="){
        next();
    }else{
    res.status(401).send("Valid users only");
    }

}
app.use(protection);*/



app.get('/', (req, res) => {

    db.collection('inputs').find().toArray((err, items)=>{
        res.send(`<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="formCreate" action = "/submitted" method ="POST">
        <div class="d-flex align-items-center">
          <input name = "input" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id= "unordered" class="list-group pb-5">
    </ul>

  </div>
  
</body>
<script>let dataBase = ${JSON.stringify(items)} </script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src ="/front.js"></script>
</html>`);
    });
    
});

app.post('/submitted', (req, res) =>{
    let empty = new RegExp(/^[a-zA-Z][1-9]?/);
    if(empty.test(req.body.text)){
        let clean = sanite(req.body.text, {allowedTags: [], allowedAttributes: {}})
        db.collection('inputs').insertOne({text:clean}, (err,info)=>{
            res.json(info.ops[0]);
        });
    }

  
});

app.post('/update-item', (req, res) => {
    let clean = sanite(req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('inputs').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)},{$set: {text: clean}},()=>{
    res.send("success");
  });
});

app.post('/delete-item', (req, res) => {
  db.collection('inputs').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, ()=>{
    res.send("success");
  });
});
