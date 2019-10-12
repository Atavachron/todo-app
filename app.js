const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const mongodb = require('mongodb');
let db;

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.json());


//Update connection string in order to be able to connect to your TodoApp database in your Atlas MongoDB account
const connectionString = 'mongodb+srv://appUser:<password>@cluster0-3fldm.mongodb.net/TodoApp?retryWrites=true&w=majority' 
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  db = client.db();
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});


app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, items) => {
    res.send(`
  <!DOCTYPE html>
  <html>
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
        <form id="item-form" action="/add-item" method="POST">
          <div class="d-flex align-items-center">
            <input id="text-field" autofocus autocomplete="off" class="form-control mr-3" type="text" name="item" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>
      
      <ul id="item-list" class="list-group pb-5">
      </ul>
      
    </div>
    <script>
      let items = ${JSON.stringify(items)}
    </script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="/browser.js"></script>
  </body>
  </html>
  `);
  })
  
})

app.post('/add-item', (req, res) => {
  db.collection('items').insertOne({text: req.body.text}, (err, info) => {
    res.send(info.ops[0]);
  })
})

app.post('/edit-item', (req, res) => {
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, () => {
    res.send("Success");
  })
})

app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, () => {
    res.send("Success");
  })
})