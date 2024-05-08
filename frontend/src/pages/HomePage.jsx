import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link component
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import { Avatar, Image } from "@chakra-ui/react"; // Import Avatar and Image components from Chakra UI
import userAtom from "../atoms/userAtom";
import SuggestedPosts from "./SuggestedPosts";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const user = useRecoilValue(userAtom);

  console.log(user);

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        let endpoint = "/api/posts/feed";
        // if (!user) {
        //   endpoint = "/api/posts/public";
        // }
        const res = await fetch(endpoint);
        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          //   throw new Error(data.error || "Failed to fetch posts");
        }
      } catch (error) {
        // showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts, user]);

  // Filter suggested posts based on user's selected categories
  //   const filteredSuggestedPosts = user
  //     ? suggestedPosts.filter((suggestedPost) =>
  //         user.selectedOptions.some((category) =>
  //           suggestedPost.categories.includes(category)
  //         )
  //       )
  //     : [];

  return (
    <Flex gap="10" alignItems="flex-start">
      <Box flex={100}>
        {!loading && posts.length === 0 && (
          <>
            <SuggestedPosts category="technology" />
          </>
        )}

        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}

        <>
          <SuggestedPosts category="technology" />
        </>
      </Box>
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block",
        }}
      >
        {user && <SuggestedUsers />}
      </Box>
    </Flex>
  );
};

export default HomePage;
