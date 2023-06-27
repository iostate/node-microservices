const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
const PORT = 4005;

app.use(bodyParser.json());
app.use(cors());

app.post('/events', (req, res) => {
  const event = req.body;

  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err);
  });

  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err);
  });
  // axios.post('http://localhost:4002/events', event).catch((err) => {
  //   console.log(err);
  // });

  res.status(201).send('Status: OK');

  // axios.post('http://locahost:4003/events', event).catch(err) {
  //   console.log(err);
  // }
});

app.listen(PORT, console.log(`Listening on port ${PORT}`));
