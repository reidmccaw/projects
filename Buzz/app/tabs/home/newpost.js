import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Theme from "@/assets/theme";
import useSession from "@/utils/useSession";
import db from "@/database/db";

export default function NewPost({ onClose }) {
  const [username, setUsername] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();

  const submitPost = async () => {
    setIsLoading(true);
    try {
      const userId = session.user.id;
      const postUsername = username || "Anonymous";

      const { error } = await db.from("posts").insert([
        {
          user_id: userId,
          username: postUsername,
          text: inputText,
        },
      ]);

      if (error) {
        console.error("Error inserting post:", error);
        alert("Could not submit the post.");
      } else {
        alert("Your post has been submitted!");
        setInputText("");
        setUsername(null);
        onClose();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitDisabled = isLoading || inputText.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity onPress={submitPost} disabled={submitDisabled}>
          <Text
            style={[
              styles.submitButtonText,
              submitDisabled && styles.submitButtonDisabled,
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.nameInputContainer}>
        <Text style={styles.nameInputPrompt}>Post as:</Text>
        <TextInput
          style={styles.nameInput}
          value={username}
          onChangeText={setUsername}
          placeholder={"Anonymous"}
          placeholderTextColor={Theme.colors.textTertiary}
        />
      </View>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder={"What do you want to share?"}
        placeholderTextColor={Theme.colors.textSecondary}
        multiline
        textAlignVertical="top"
        autoFocus
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.backgroundSecondary,
  },
  cancelButtonText: {
    color: Theme.colors.textHighlighted,
    fontSize: 18,
  },
  headerTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButtonText: {
    color: Theme.colors.textHighlighted,
    fontSize: 18,
  },
  submitButtonDisabled: {
    color: Theme.colors.textTertiary,
  },
  nameInputContainer: {
    width: "100%",
    padding: 16,
    gap: 8,
    backgroundColor: Theme.colors.backgroundPrimary, // Keeps the name input area black
  },
  nameInputPrompt: {
    color: Theme.colors.textPrimary,
  },
  nameInput: {
    color: Theme.colors.textSecondary,
  },
  input: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "black", // Pure black background for the main input area
    color: Theme.colors.textPrimary, // Text color is primary to ensure visibility
  },
});
