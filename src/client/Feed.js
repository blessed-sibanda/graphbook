import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "./components/loading";
import Error from "./components/error";
import Post from "./components/post";

const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
      posts {
        id
        text
        user {
          avatar
          username
        }
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
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const [postContent, setPostContent] = useState("");
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      // const data = cache.readQuery({ query: GET_POSTS });
      // const newData = { posts: [addPost, ...data.posts] };
      // cache.writeQuery({ query: GET_POSTS, data: newData });

      cache.modify({
        fields: {
          postsFeed(existingPostsFeed) {
            const { posts: existingPosts } = existingPostsFeed;
            const newPostRef = cache.writeFragment({
              data: addPost,
              fragment: gql`
                fragment NewPost on Post {
                  id
                }
              `,
            });

            return {
              ...existingPostsFeed,
              posts: [newPostRef, ...existingPosts],
            };
          },
        },
      });
    },
    optimisticResponse: {
      __typename: "mutation",
      addPost: {
        __typename: "Post",
        text: postContent,
        id: -1,
        user: {
          __typename: "User",
          username: "Loading...",
          avatar: "/uploads/loading.gif",
        },
      },
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addPost({ variables: { post: { text: postContent } } });
    setPostContent("");
  };

  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    pollInterval: 5000,
    variables: { page: 0, limit: 10 },
  });

  if (loading) return <Loading />;
  if (error) return <Error>{`Error! ${error.message}`}</Error>;

  const { postsFeed } = data;
  const { posts } = postsFeed;

  const loadMore = (fetchMore) => {
    const self = this;
    fetchMore({
      variables: {
        page: page + 1,
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        if (!fetchMoreResult.postsFeed.posts.length) {
          setHasMore(false);
          return previousResult;
        }
        setPage(page + 1);
        const newData = {
          postsFeed: {
            __typename: "PostFeed",
            posts: [
              ...previousResult.postsFeed.posts,
              ...fetchMoreResult.postsFeed.posts,
            ],
          },
        };
        return newData;
      },
    });
  };

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
        <InfiniteScroll
          dataLength={posts.length}
          next={() => loadMore(fetchMore)}
          hasMore={hasMore}
          loader={
            <div className="loader" key={"loader"}>
              Loading ...
            </div>
          }
        >
          {posts.map((post, i) => (
            <Post key={post.id} post={post} />
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Feed;
