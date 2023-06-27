const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();

const PORT = 4001;

app.use(cors());
app.use(bodyParser.json());
const commentsByPostId = {};

app.post('/events', (req, res) => {
  console.log('Event Received: ', req.body.type);
  res.status(200).send({});
});

app.get('/posts/:id/comments', (req, res) => {
  res.status(200).send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const { content } = req.body;
  // NOT the post ID
  const commentId = randomBytes(4).toString('hex');

  // console.log(newBody);
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({
    id: commentId,
    content,
  });

  await axios.post('http://localhost:4005', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  commentsByPostId[req.params.id] = comments;

  // res.status(201).send(commentsByPostId[req.params.id]);
  res.status(201).send(comments);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
