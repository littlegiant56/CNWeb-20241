import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Post from "../posts/Post";
import { CreatePost } from "../components/CreatePost";
import { getAllPost, getPostByOffset } from "../services/API";
import { socket } from "../socket";
import InfiniteScroll from "react-infinite-scroll-component";

export default function NewFeeds() {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const NUMBER_OF_POSTS = 5;

  const handleLoadMore = () => {
    getPostByOffset(posts[posts.length - 1].id, NUMBER_OF_POSTS)
      .then((res) => {
        console.log("nam getPostByOffset");
        res.data.posts.forEach((doc) => {
          setPosts((prev) => {
            const newPosts = res.data.posts.map((doc) => ({
              id: doc.id,
              ...doc.data,
            }));
            const uniquePosts = newPosts.filter(
              (newPost) => !prev.some((post) => post.id === newPost.id)
            );
            return [...prev, ...uniquePosts];
          });
        });
        setHasMore(res.data.hasMore);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    let isMounted = true;

    getPostByOffset(null, NUMBER_OF_POSTS)
      .then((res) => {
        if (isMounted) {
          const newPosts = res.data.posts.map((doc) => ({
            id: doc.id,
            ...doc.data,
          }));
          setPosts(newPosts);
          setHasMore(res.data.hasMore);
        }
      })
      .catch((error) => console.log(error));

    return () => {
      isMounted = false; // Hủy bỏ hiệu ứng khi component bị unmount
    };
  }, []);

  return (
    <Container className="w-75">
      <CreatePost posts={posts} setPosts={setPosts} />
      <InfiniteScroll
        dataLength={posts.length}
        next={handleLoadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        {posts.map((post, index) => (
          <Post
            key={index}
            post={post}
            posts={posts}
            setPosts={setPosts}
            style={{ marginBottom: "50px" }}
          />
        ))}
      </InfiniteScroll>
    </Container>
  );
}
