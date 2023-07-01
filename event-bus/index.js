const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();

const events = [];

const PORT = 4005;

app.use(bodyParser.json());
app.use(cors());

app.get('/events', (req, res) => {
  res.status(200).send(events);
});

app.post('/events', (req, res) => {
  const event = req.body;
  events.push(event);

  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err);
  });

  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err);
  });
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err);
  });
  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log(err);
  });

  res.status(200).send('Status: OK');

  // axios.post('http://locahost:4003/events', event).catch(err) {
  //   console.log(err);
  // }
});

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  try {
    const res = await axios.get('http://localhost:4005/events');

    for (let event of res.data) {
      console.log('Processing event:', event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
