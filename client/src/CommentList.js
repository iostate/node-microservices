import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let status = comment.status;
    console.log(status);
    if (status === 'pending') {
      comment.content = 'This post is awaiting approval.';
    }
    if (status === 'rejected') {
      comment.content = 'This post has been rejected';
    }

    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
