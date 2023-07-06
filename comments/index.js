/**
 * Comments are stored in this in storage database.
 * They are then sent to the event bus, where it can be sent to the query
 * microservice and the moderation microservice.
 */

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

const PORT = 4001;

app.use(cors());
app.use(bodyParser.json());
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const { content } = req.body;
  const commentId = randomBytes(4).toString('hex');

  const comments = commentsByPostId[req.params.id] || [];

  // All comments will begin with status of 'pending'
  comments.push({
    id: commentId,
    content,
    status: 'pending',
  });
  console.log('commentsService: ');
  console.log(comments);

  commentsByPostId[req.params.id] = comments;

  // event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });

  // res.status(201).send(commentsByPostId[req.params.id]);
  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Event Received: ', req.body.type);

  const { type, data } = req.body;

  // Receiving event from Moderation MicroService
  // Update status of comment to the status given by Moderation Microservice
  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    // const comment = comments.find((comment) => {
    //   return comment.id === id;
    // });
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    // const { id, postId, status, content } = data;
    // Send to Event Bus for Comment Service to update in its db
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id: id,
        postId,
        status,
        content,
      },
    });
  }

  res.status(200).send({});
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
