import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";

const GET_POSTS = gql`
  {
    posts {
      id
      text
      user {
        avatar
        username
      }
    }
  }
`;

const ADD_POST = gql`
  mutation addPost($post: PostInput!) {
    addPost(post: $post) {
      id
      text
      user {
        username
        avatar
      }
    }
  }
`;

const Feed = () => {
  const [postContent, setPostContent] = useState("");
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addPost({ variables: { post: { text: postContent } } });
    setPostContent("");
  };

  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const { posts } = data;

  return (
    <>
      <div className="postForm">
        <form onSubmit={handleSubmit}>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your custom post!"
          ></textarea>
          <input type="submit" value="Submit" />
        </form>
      </div>
      <div className="feed">
        {posts.map((post, i) => (
          <div key={post.id} className="post">
            <div className="header">
              <img src={`http://localhost:8000${post.user.avatar}`} alt="" />
              <h2>{post.user.username}</h2>
            </div>
            <p className="content">{post.text}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Feed;
