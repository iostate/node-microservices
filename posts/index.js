const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
const PORT = 4000;

const posts = {};

app.use(cors());

app.use(bodyParser.json());

// Events
app.post('/events', (req, res) => {
  console.log('Event Received: ', req.body.type);
  res.status(200).send({});
});

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
