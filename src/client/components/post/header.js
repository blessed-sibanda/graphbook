import React from "react";

export default ({ post }) => {
  return (
    <div className="header">
      <img src={`http://localhost:8000${post.user.avatar}`} alt="" />
      <div>
        <h2>{post.user.username}</h2>
      </div>
    </div>
  );
};
