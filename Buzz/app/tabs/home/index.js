import React, { useState } from "react";
import { StyleSheet, View, Modal, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Theme from "@/assets/theme";
import Feed from "@/components/Feed";
import NewPost from "./newpost";
import { useNavigation } from "expo-router";

export default function Home() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const navigateToComments = (postId) => {
    navigation.navigate("details", { id: postId });
  };

  return (
    <View style={styles.container}>
      <Feed shouldNavigateToComments={true} onPostPress={navigateToComments} />

      <TouchableOpacity style={styles.postButtonContainer} onPress={openModal}>
        <View style={styles.postButton}>
          <FontAwesome size={32} name="plus" color={Theme.colors.textPrimary} />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <NewPost onClose={closeModal} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Theme.colors.backgroundPrimary,
  },
  postButtonContainer: {
    position: "absolute",
    right: 3,
    bottom: 16,
  },
  postButton: {
    backgroundColor: Theme.colors.iconHighlighted,
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
