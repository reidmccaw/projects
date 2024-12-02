import { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  View,
  TextInput,
} from "react-native";
import { useSpotifyAuth, useSpotifyTracks } from "./utils";
import { Themes } from "./assets/Themes";
import Images from "./assets/Images/images";
import Song from "./utils/Song";
import millisToMinutesAndSeconds from "./utils/millisToMinutesAndSeconds";
import Time from "./assets/time.png";
import getEnv from "./utils/env";
const { ALBUM_ID } = getEnv();
import { getAlbumTracks, searchAlbums } from "./utils/apiOptions";

const windowWidth = Dimensions.get("window").width;

export default function App() {
  const { token, getSpotifyAuth } = useSpotifyAuth();
  const [tracks, setTracks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (token) {
      getAlbumTracks(ALBUM_ID, token).then((data) => {
        setTracks(data || []);
      });
    }
  }, [token]);

  const handleSearch = () => {
    if (searchText && token) {
      searchAlbums(searchText, token).then((results) => {
        setSearchResults(results || []);
        setIsSearching(true);
      });
    }
  };

  const handleAlbumSelect = (albumId) => {
    if (albumId && token) {
      getAlbumTracks(albumId, token).then((data) => {
        setTracks(data || []);
        setIsSearching(false);
      });
    }
  };

  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => getSpotifyAuth()}
        >
          <Image source={Images.spotify} style={styles.icon} />
          <Text style={styles.loginText}> CONNECT WITH SPOTIFY </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const albumCoverUrl = tracks && tracks[0]?.imageUrl;
  const albumName = tracks && tracks[0]?.albumName;
  const artistName =
    tracks && tracks[0]?.album?.artists
      ? tracks[0].album.artists.map((artist) => artist.name).join(", ")
      : tracks[0]?.songArtists.map((artist) => artist.name).join(", ");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={Images.spotify} style={styles.headerIcon} />
        <Text style={styles.headerTopText}>Listen</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="What do you want to play next?"
          placeholderTextColor="#B3B3B3"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={{ color: "white" }}>Search</Text>
        </TouchableOpacity>
      </View>

      {tracks && (
        <View style={styles.headerContainer}>
          <Image source={{ uri: albumCoverUrl }} style={styles.albumCover} />
          <View style={styles.albumInfo}>
            <Text style={{ fontSize: 10, color: "white" }}>Album</Text>
            <Text
              style={styles.albumName}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {albumName}
            </Text>
            <Text style={styles.artistName}>{artistName}</Text>
          </View>
        </View>
      )}

      <View style={styles.headerRow}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerText}>#</Text>
          <Text style={styles.headerText}>Title</Text>
        </View>
        <Image source={Time} style={styles.time} />
      </View>

      {isSearching ? (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.albumId}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleAlbumSelect(item.albumId)}>
              <View style={styles.searchResult}>
                <Image
                  source={{ uri: item.albumCoverUrl }}
                  style={styles.smallAlbumCover}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Song
              songNumber={index + 1}
              albumImage={item.imageUrl}
              title={item.songTitle}
              artist={item.songArtists.map((artist) => artist.name).join(", ")}
              album={item.albumName}
              duration={millisToMinutesAndSeconds(item.duration)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Themes.colors.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Themes.colors.background,
    width: "100%",
    left: windowWidth / 3,
  },
  headerIcon: {
    width: 26,
    height: 26,
    marginRight: 8,
  },
  headerTopText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  searchContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 0,
    backgroundColor: Themes.colors.background,
  },
  searchBar: {
    backgroundColor: "#2E2E2E",
    color: "white",
    padding: 10,
    borderRadius: 20,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  searchButton: {
    marginTop: 10,
    backgroundColor: "#1DB954",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  smallAlbumCover: {
    width: 130,
    height: 130,
    borderRadius: 5,
    marginRight: 12,
  },
  searchResult: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Themes.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  headerContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: Themes.colors.background,
    width: windowWidth,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  albumCover: {
    width: windowWidth * 0.45,
    height: windowWidth * 0.45,
    borderRadius: 8,
  },
  albumInfo: {
    flex: 1,
    flexDirection: "column",
    marginLeft: 16,
    maxWidth: windowWidth * 0.45,
  },
  albumName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginVertical: 3,
    marginBottom: 0,
  },
  artistName: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    marginVertical: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingTop: 10,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingBottom: 15,
    backgroundColor: Themes.colors.background,
    height: 45,
  },
  headerText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    width: "33%",
    textAlign: "center",
  },
  headerInfo: {
    flexDirection: "row",
    flex: 1 / 1.4,
    justifyContent: "left",
    right: 20,
  },
  time: {
    height: 20,
    width: 20,
    marginRight: 18,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#1DB954",
    width: "60%",
    borderRadius: (windowWidth * 0.6) / 2,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    height: 23,
    width: 23,
  },
  loginText: {
    fontSize: 15,
    color: "white",
  },
});
