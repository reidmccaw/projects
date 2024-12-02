import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, RefreshControl } from "react-native";
import Theme from "@/assets/theme";
import Post from "@/components/Post";
import Loading from "@/components/Loading";
import db from "@/database/db";
import timeAgo from "@/utils/timeAgo";
import useSession from "@/utils/useSession";
export default function Feed({
  shouldNavigateToComments = false,
  fetchUsersPostsOnly = false,
}) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const session = useSession();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = db.from("posts_with_counts").select("*");

      if (fetchUsersPostsOnly && session?.user?.id) {
        query = query.eq("user_id", session.user.id);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [session]);

  if (isLoading && !isRefreshing) {
    return <Loading />;
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => (
        <Post
          shouldNavigateOnPress={shouldNavigateToComments}
          id={item.id}
          username={item.username}
          timestamp={timeAgo(item.timestamp)}
          text={item.text}
          score={item.like_count}
          vote={item.vote}
          commentCount={item.comment_count}
        />
      )}
      contentContainerStyle={styles.posts}
      style={[
        styles.postsContainer,
        { backgroundColor: Theme.colors.backgroundPrimary },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true);
            fetchPosts();
          }}
          tintColor={Theme.colors.textPrimary} // only applies to iOS
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  postsContainer: {
    width: "100%",
  },
  posts: {
    gap: 8,
  },
});
