require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const urlDB = require('./urlDB');

// Basic Configuration
const port = process.env.PORT || 3000;
var database = new urlDB();

app.use(cors());
app.use(bodyParser.urlencoded())
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res){
  try
  {
    let index = -1;
    let url = new URL(req.body.url);
    dns.lookup(url.hostname, (err, address, family) =>
    {
      
      if(!err)
      {
        console.log(database._urls);
        index = database.existsUrl(req.body.url);
        if(index == -1) //Url doesnt exists
        {          
          console.log("Hola 1");
          index = database.addUrl(req.body.url);
          return res.json({"original_url":database.getUrl(index), "short_url":index});
        } 
        else //Url exists
        {
          console.log("Hola 2");
          return res.json({"original_url":database.getUrl(index), "short_url":index});
        }
      }
      else{
        res.json({"error":"Invalid URL"});
      }
    });
  }
  catch(err)
  {
    res.json({"error":"Invalid URL"});
  }
});

app.get('/api/shorturl/:id', function(req, res){
  try {
    url = database.getUrl(Number(req.params.id));
    console.log(url);    
    res.redirect(url);
  } catch (error) {
    res.json({"error":"No short URL found for the given input"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
