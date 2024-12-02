import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter, Redirect } from "expo-router";
import Theme from "@/assets/theme";
import db from "@/database/db";
import useSession from "@/utils/useSession";

export default function Post({
  shouldNavigateOnPress = true,
  id,
  username,
  timestamp,
  text,
  score: initialScore,
  vote: initialVote,
  commentCount,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState(initialVote);
  const session = useSession();
  const router = useRouter();

  const openComments = () => {
    router.push(`/tabs/home/details?id=${id}`);
  };

  const submitVote = async (newVote) => {
    setIsLoading(true);
    try {
      const { data: existingLikes, error: fetchError } = await db
        .from("likes")
        .select("*")
        .eq("post_id", id)
        .eq("user_id", session.user.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching existing like:", fetchError);
        alert("An error occurred. Please try again.");
        setIsLoading(false);
        return;
      }

      if (existingLikes) {
        if (existingLikes.vote === newVote) {
          const { error: deleteError } = await db
            .from("likes")
            .delete()
            .eq("post_id", id)
            .eq("user_id", session.user.id);

          if (deleteError) throw deleteError;
          setScore((prevScore) => prevScore - newVote);
          setVote(0);
        } else {
          const { error: updateError } = await db
            .from("likes")
            .update({ vote: newVote })
            .eq("post_id", id)
            .eq("user_id", session.user.id);

          if (updateError) throw updateError;
          setScore((prevScore) => prevScore + newVote - existingLikes.vote);
          setVote(newVote);
        }
      } else {
        const { error: insertError } = await db.from("likes").insert([
          {
            post_id: id,
            user_id: session.user.id,
            vote: newVote,
          },
        ]);

        if (insertError) throw insertError;
        setScore((prevScore) => prevScore + newVote);
        setVote(newVote);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("An error occurred while submitting your vote.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={shouldNavigateOnPress ? openComments : undefined}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome
            size={Theme.sizes.iconSmall}
            name="user"
            color={Theme.colors.iconSecondary}
          />
          <Text style={styles.username}>{username}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.text}>{text}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.timestamp}>{timestamp}</Text>
          <View style={styles.comment}>
            <FontAwesome
              size={Theme.sizes.iconSmall}
              name="comment"
              color={Theme.colors.iconSecondary}
            />
            <Text style={styles.commentCount}>{commentCount}</Text>
          </View>
        </View>
      </View>
      <View style={styles.scoreContainer}>
        <TouchableOpacity
          onPress={() => (vote > 0 ? submitVote(0) : submitVote(1))}
          style={styles.upvoteButton}
          disabled={isLoading}
        >
          <FontAwesome
            size={16}
            name="chevron-up"
            color={
              vote > 0
                ? Theme.colors.iconHighlighted
                : Theme.colors.iconSecondary
            }
          />
        </TouchableOpacity>
        <Text style={styles.score}>{score}</Text>
        <TouchableOpacity
          onPress={() => (vote < 0 ? submitVote(0) : submitVote(-1))}
          style={styles.downvoteButton}
          disabled={isLoading}
        >
          <FontAwesome
            size={16}
            name="chevron-down"
            color={
              vote < 0
                ? Theme.colors.iconHighlighted
                : Theme.colors.iconSecondary
            }
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 8,
    backgroundColor: Theme.colors.backgroundSecondary,
    flexDirection: "row",
  },
  content: {
    flex: 1,
    gap: 8,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  body: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  scoreContainer: {
    alignItems: "center",
    marginLeft: 16,
  },
  text: {
    color: Theme.colors.textPrimary,
    fontWeight: "bold",
    fontSize: Theme.sizes.textMedium,
  },
  username: {
    color: Theme.colors.textSecondary,
    fontWeight: "bold",
    marginLeft: 8,
  },
  timestamp: {
    color: Theme.colors.textSecondary,
  },
  comment: {
    flexDirection: "row",
  },
  commentCount: {
    color: Theme.colors.textSecondary,
    marginLeft: 8,
  },
  score: {
    color: Theme.colors.textHighlighted,
    fontWeight: "bold",
    fontSize: Theme.sizes.textLarge,
  },
  upvoteButton: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  downvoteButton: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
  },
});
