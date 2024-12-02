import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import db from "@/database/db";
import timeAgo from "@/utils/timeAgo";
import Loading from "@/components/Loading";
import useSession from "@/utils/useSession";
import Theme from "@/assets/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Comment from "./Comment";

export default function CommentFeed({ postId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const session = useSession();

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await db
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("timestamp", { ascending: false });
      if (error) throw error;
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const submitComment = async () => {
    if (newComment.trim() === "") return;

    if (!session || !session.user || !session.user.id) {
      console.error("User ID is missing.");
      return;
    }

    try {
      const { error } = await db.from("comments").insert([
        {
          post_id: postId,
          user_id: session.user.id,
          username: "Anonymous",
          text: newComment,
          timestamp: new Date().toISOString(),
        },
      ]);
      if (error) throw error;

      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (isLoading && !isRefreshing) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Comment
            username={item.username}
            timestamp={timeAgo(item.timestamp)}
            text={item.text}
          />
        )}
        contentContainerStyle={styles.posts}
        style={styles.postsContainer}
        ListEmptyComponent={
          <Text style={styles.noComments}>
            No comments yet. Be the first to comment!
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              fetchComments();
            }}
            tintColor={Theme.colors.textPrimary}
          />
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.postButton}
          onPress={submitComment}
          disabled={!newComment.trim()}
        >
          <FontAwesome
            name="send"
            size={24}
            color={Theme.colors.iconHighlighted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    width: "100%",
  },
  postsContainer: {
    marginTop: 15,
    paddingBottom: 1,
  },
  posts: {
    gap: 8,
  },
  commentCard: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  username: {
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginLeft: 8,
  },
  commentText: {
    fontSize: 16,
    color: Theme.colors.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 2,
    marginTop: 4,
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundSecondary,
    color: Theme.colors.textPrimary,
    padding: 15,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 3,
    marginTop: 3,
    marginLeft: 8,
  },
  postButton: {
    padding: 4,
    marginRight: 10,
  },
  postButtonText: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
  },
  noComments: {
    color: Theme.colors.textSecondary,
    textAlign: "center",
    marginVertical: 16,
  },
});
