const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();

const PORT = 4002;

app.use(cors());
app.use(bodyParser.json());
const posts = {};

const handleEvent = (type, data) => {
  if (type == 'PostCreated') {
    console.log('QueryService received PostCreated');
    const { id, title } = data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  }

  if (type == 'CommentCreated') {
    console.log('QueryService received CommentCreated');
    const post = posts[data.postId];
    // All comments created are automatically stored
    // with the status of 'pending'
    post.comments.push({
      id: data.id,
      content: data.content,
      status: data.status,
    });
  }

  // this event will change status to either 'approved' or 'rejected'
  if (type == 'CommentModerated') {
    const { status } = data;
    console.log('QueryService received CommentModerated');
    console.log('Modifying comment to status of ' + status);
    // a comment on a posts[postId]
    // posts[postId].comments.find({id: commentId})
    const post = posts[data.postId];
    post.status = status;
  }

  if (type == 'CommentUpdated') {
    const { id, status, postId, content } = data;
    console.log('QueryService received', type);

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.comment = content;
  }
};

app.get('/posts', (req, res) => {
  res.status(200).json(posts);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  // handle the events as they come in
  handleEvent(type, data);

  console.log(posts);
  res.status(201).send({});
});

app.listen(4002, async () => {
  console.log('Port is listening on port 4002');

  try {
    // grab all events as soon as server is online
    // in case it was off at any point
    const res = await axios.get('http://event-bus-srv:4005/events');
    for (let event of res.data) {
      console.log('Processing Event: ', event.type);
      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log(err);
  }
});

process.on('SIGINT', function () {
  process.exit();
});
