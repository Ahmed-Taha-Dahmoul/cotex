import React, { useState } from 'react';

const ReplyForm = ({ onSubmit, onCancel }) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(replyText);
    setReplyText('');
  };

  return (
    <form className="comment-form reply-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Reply to this comment..."
      />
      <div>
        <button type="submit">Reply</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default ReplyForm;
