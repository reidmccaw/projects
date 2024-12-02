import { Platform } from "react-native";

const CLIENT_ID = "8a0602601d4643b8a10ee0fe44860212";
const REDIRECT_URI = "exp://10.32.3.129:19000";
const ALBUM_ID = "1AHZd3C3S8m8fFrhFxyk79";

const SEARCH_API_GETTER = (query) =>
  `https://api.spotify.com/v1/search?q=${query}&type=album&limit=20`;

const redirectUri = (uri) => {
  if (!uri) {
    const err = new Error(
      "No redirect URI provided.\nPlease provide a redirect URI in env.js.\n You can find the file in utils/env.js."
    );
    console.error(err);
    alert(err);
  }
  return Platform.OS === "web" ? "http://localhost:19006/" : uri;
};

const ENV = {
  CLIENT_ID: CLIENT_ID,
  SCOPES: [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "streaming",
    "user-read-email",
    "user-read-private",
  ],
  REDIRECT_URI: redirectUri(REDIRECT_URI),
  ALBUM_ID: ALBUM_ID,
  SPOTIFY_API: {
    DISCOVERY: {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    },
    TOP_TRACKS_API: "https://api.spotify.com/v1/me/top/tracks",
    ALBUM_TRACK_API_GETTER: (albumId) =>
      `https://api.spotify.com/v1/albums/${albumId}`,
    SEARCH_API_GETTER: SEARCH_API_GETTER,
  },
};

const getEnv = () => ENV;
export default getEnv;
