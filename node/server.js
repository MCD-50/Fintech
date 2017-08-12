/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//------------------------------------------------------------------------------
// Deployment tracking
//------------------------------------------------------------------------------
require('cf-deployment-tracker-client').track();

const express = require('express');
const cfenv = require('cfenv');
const app = express();
const bodyParser = require('body-parser')

const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
const path = require('path');
const request = require('request');
// const port = process.env.PORT || 4000;

// load local VCAP configuration
let vcapLocal = null
try {
  vcapLocal = require('./vcap-local.json');
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
  console.error(e);
}

const appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

let db;
if (appEnv.services['todo-db']) {
  db = require('./lib/compose-db')(appEnv.services['todo-db'][0].credentials);
} else {
  db = require('./lib/in-memory')();
}
console.log('Using', db.type());

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json()); // parse application/json

app.use(express.static(__dirname + '/www'));


app.get('/api/expenses', (req, res) => {
  db.search().then(expenses => {
    res.send(expenses);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});


app.post('/api/expenses', (req, res) => {
  console.log(req.body)
  db.create(req.body).then(expenses => {
    res.send(expenses);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});


app.get('/api/expenses/:id', (req, res) => {
  db.read(req.params.id).then(expenses => {
    res.send(expenses);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});


app.put('/api/expenses/:id', (req, res) => {
  db.update(req.params.id, req.body).then(expenses => {
    res.send(expenses);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});


app.delete('/api/expenses/:id', (req, res) => {
  db.delete(req.params.id).then(expenses => {
    res.send(expenses);
  }).catch(err => {
    res.status(500).send({ error: err });
  });
});


// connect to the database
db.init().then(() => {
  // start server on the specified port and binding host
  app.listen(appEnv.port, "0.0.0.0", function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
  });
});


const CONNECTION = 'connection';
const MESSAGE = 'message';
const JOIN = 'join';
const LEAVE = 'leave';
const JOINED = 'joined';
const LEFT = 'left';
const ERROR = 'error';



app.use(cors());

http.listen(appEnv.port, () => {
  console.log('listening on :', port);
});

io.on(CONNECTION, (socket) => {

  socket.on(JOIN, (room_name) => {
    //if player is already added then remove
    socket.join(room_name);
    io.emit(JOINED, "Joined");
  });

  socket.on(LEAVE, (room_name) => {
    //if player is added then remove.
    socket.leave(room_name);
    io.emit(LEFT, "Left");
  });

  socket.on(MESSAGE, (message) => {
    if (message.toLowerCase().includes('welcome')) {
      io.emit(MESSAGE, { text: message });
      return;
    }
    // var options = {
    //   method: 'POST',
    //   url: SERVER_URL,
    //   headers:
    //   {
    //     'accept': 'application/json',
    //     'cache-control': 'no-cache',
    //     'content-type': 'application/json'
    //   },
    //   body:
    //   {
    //     text: message
    //   },
    //   json: true
    // };

    // request(options, (error, response, body) => {
    //   if (error) {
    //     io.emit(MESSAGE, { text: 'Something wrong. I answer python questions' });
    //   } else if (body) {
    //     io.emit(MESSAGE, body.message);
    //   }
    // });

    io.emit(MESSAGE, { text: 'Hang on!! getting you there. Im not that cool, I need some time.\n\n\n Processing....' });

  });
});