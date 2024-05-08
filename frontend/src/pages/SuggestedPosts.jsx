import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Divider,
  Button,
  Text,
  Avatar,
  Image,
  systemProps,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const SuggestedPosts = ({ category }) => {
  const [suggestedPosts, setSuggestedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    const fetchSuggestedPosts = async () => {
      setLoading(true);
      try {
        const endpoint = `https://newsapi.org/v2/top-headlines?country=IN&category=${category}&apiKey=f0e1c8e7ea964e38b089c4c4e4416844`;
        const res = await fetch(endpoint);
        const data = await res.json();
        if (res.ok) {
          setSuggestedPosts(data.articles);
        } else {
          throw new Error(data.error || "Failed to fetch suggested posts");
        }
      } catch (error) {
        console.error("Error fetching suggested posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedPosts();
  }, [category]);

  const handlePostIntoAccount = async (post) => {
    const isAuthenticated = user !== null;

    if (!user) {
      setAuthScreen("login");
    } else {
      console.log("jevin");
      // User is authenticated, create a post
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postedBy: user._id, // Replace with the actual user ID
            text: post.title,
            img: post.urlToImage,
          }),
        });

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        // Show success message or perform any other action
        showToast("Success", "Post created successfully", "success");
        setSuggestedPosts([data, ...suggestedPosts]);
      } catch (error) {
        console.error("Error creating post:", error);
        // Handle error, show error message, etc.
      }
    }
  };

  if (loading) {
    return <Text>Loading suggested posts...</Text>;
  }

  if (redirectToLogin) {
    return <Redirect to="/auth" />; // Redirect here
  }

  return (
    <>
      {suggestedPosts.map((post, index) => (
        <>
          {post.urlToImage && (
            <Flex>
              <Flex w={"full"} alignItems={"center"} gap={3}>
                <Avatar name={post.author} src={post.urlToImage} size={"md"} />
                <Flex>
                  <Text fontSize={"md"} fontWeight={"bold"}>
                    {post.author}
                  </Text>
                  <Image src="/verified.png" w="4" h={4} ml={4} />
                </Flex>
              </Flex>
              <Flex gap={4} alignItems={"center"}>
                <Text
                  fontSize={"xs"}
                  width={36}
                  textAlign={"right"}
                  color={"gray.light"}
                >
                  {post.publishedAt}
                </Text>

                {/* {currentUser?._id === user._id && (
                <DeleteIcon
                  size={20}
                  cursor={"pointer"}
                  onClick={handleDeletePost}
                />
              )} */}
              </Flex>
            </Flex>
          )}

          {post.urlToImage && (
            <Text my={3} fontSize="xl">
              {post.title}
            </Text>
          )}

          {post.urlToImage && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.urlToImage} w={"full"} />
            </Box>
          )}

          {post.urlToImage && <Text my={3}>{post.description}</Text>}

          {post.urlToImage && (
            <Flex gap={3} my={3} justifyContent={"start"}>
              <Link to={post.url} target="_blank">
                <Button colorScheme="twitter">Read Full article</Button>
              </Link>

              {user ? (
                <Button
                  colorScheme="twitter"
                  onClick={() => handlePostIntoAccount(post)}
                >
                  Post into your account
                </Button>
              ) : (
                <Link
                  as={RouterLink}
                  to={"/auth"}
                  onClick={() => setAuthScreen("login")}
                >
                  <Button
                    colorScheme="twitter"
                  >
                    Login to post
                  </Button>
                </Link>
              )}
            </Flex>
          )}

          {post.urlToImage && <Divider my={4} />}
        </>
      ))}
    </>
  );
};

export default SuggestedPosts;
