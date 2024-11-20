const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }));


const User = require('./schemas.js').User;
const Exercise = require('./schemas.js').Exercise;

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', (req,res) =>
{
  const newUser = new User(
    {
      username: req.body.username,
    }
  );
  newUser.save()
    .then(saved => res.json({'username': saved.username, '_id': saved._id.toString()}))
    .catch(error => res.json({"Error": "Error"}));
});

app.post('/api/users/:_id/exercises', (req,res) =>
{
    const id = req.params._id;
    let date = (req.body.date)? new Date(req.body.date) : new Date();
    
    if(!isNaN(date.getTime()))
    {
      let duration = Number(req.body.duration);
      let description = String(req.body.description)
      
      if(!isNaN(duration) && (req.body.description != '' && description.length > 0) && description != undefined)
      {
        User.findById(id).exec()
        .then(finded => {
          new Exercise(
            {
              user_id: finded._id.toString(),
              description: description,
              duration: duration,
              date: date,              
            }
          )
          .save()
          .then(saved => res.json({'_id': finded._id.toString(), 
                                    'username': finded.username, 
                                    'date': new Date(saved.date).toDateString(),
                                    'duration': saved.duration,
                                    'description': saved.description
                                  }));
        })
        .catch(error => {res.json({"Error": "User not finded"}); console.log(error);});
      }
      else
      {
        console.log("Required fields not submitted");
        res.json({"Error": "Description or duration not submitted"});
      }
    }
    else
    {
      res.json({"Error": "Fecha invalida"});
    }
});
  
app.get('/api/users', (req, res) => 
{
  User.find({}).exec().then(users => res.json(users)).catch(err => console.log(err));
});

app.get('/api/users/:_id/logs', (req, res) => {
  let filter = {}, query = null;
  const userId = req.params._id;
  const {from, to, limit} = req.query;

  if(userId) filter.user_id = userId;
  if(from) filter.date = {...filter.date, $gte: new Date(from)};
  if(to) filter.date = {...filter.date, $lte: new Date(to)};

  query = Exercise.find(filter).select('description duration date')

  if(limit) query.limit(parseInt(limit));

  query.exec().then(findedExercise =>
  {   
    const log = findedExercise.map(exercise => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));
    const exQueryLength = findedExercise.length;

    User.findById(userId)
      .exec()
      .then(findedUser => {
          res.json({"_id": userId,
                    "username":findedUser.username,
                    "count":exQueryLength,
                    "log": log                    
          });
      })
      .catch(error => {res.json({"Error": "User not finded"}); console.log(error);});
  })
  .catch(error => {res.json({"Error": "User exercise not finded"}); console.log(error);});
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
