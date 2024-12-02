import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const Song = ({ songNumber, albumImage, title, artist, album, duration }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.songNumber}>{songNumber}</Text>
      <Image source={{ uri: albumImage }} style={styles.albumImage} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artist}
        </Text>
      </View>
      <Text style={styles.album}>{album}</Text>
      <Text style={styles.duration}>{duration}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: windowWidth,
  },
  albumImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 8,
    marginLeft: 8,
  },
  songNumber: {
    fontSize: 12,
    color: "gray",
    width: 20,
    textAlign: "center",
  },
  info: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    marginRight: 12,
  },
  title: {
    fontSize: 12,
    color: "white",
  },
  artist: {
    fontSize: 12,
    color: "gray",
  },
  album: {
    fontSize: 12,
    color: "white",
    paddingEnd: 15,
  },
  duration: {
    fontSize: 12,
    color: "gray",
    marginHorizontal: 5,
  },
});

export default Song;
