const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    console.log('Event Received', type);
    console.log('Comment Created: ', data.content);

    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    console.log('Comment Status: ', status);

    // send the moderated comment back to event bus
    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  res.status(200).json({ success: true });
});

app.listen(4003, () => {
  console.log('Listening on port 4003');
});
