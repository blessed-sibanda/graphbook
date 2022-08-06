import React from "react";
import PostHeader from "./header";
import PostContent from "./content";

const Post = ({ post }) => {
  return (
    <div className="post">
      <PostHeader post={post} />
      <PostContent post={post} />
    </div>
  );
};

export default Post;
