import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Theme from "@/assets/theme";
import db from "@/database/db";
import Loading from "@/components/Loading";
import Post from "@/components/Post"; // Import the Post component
import CommentFeed from "@/components/CommentFeed";
import { useLocalSearchParams } from "expo-router";
import timeAgo from "@/utils/timeAgo";

export default function Details() {
  const { id: postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPostData = async () => {
    setIsLoading(true);
    try {
      const { data: postData, error: postError } = await db
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();
      if (postError) throw postError;
      setPost(postData);

      const { count: commentCount, error: commentError } = await db
        .from("comments")
        .select("*", { count: "exact" })
        .eq("post_id", postId);
      if (commentError) throw commentError;
      setCommentCount(commentCount);

      const { data: likesData, error: likesError } = await db
        .from("likes")
        .select("vote")
        .eq("post_id", postId);
      if (likesError) throw likesError;
      const calculatedScore = likesData.reduce(
        (acc, like) => acc + like.vote,
        0
      );
      setScore(calculatedScore);
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {post && (
        <Post
          id={post.id}
          username={post.username}
          timestamp={timeAgo(post.timestamp)}
          text={post.text}
          score={score}
          commentCount={commentCount}
          shouldNavigateOnPress={false}
        />
      )}
      <CommentFeed postId={postId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
});
