import axios from "axios";
import getEnv from "./env";

const {
  SPOTIFY_API: { TOP_TRACKS_API, ALBUM_TRACK_API_GETTER, SEARCH_API_GETTER },
} = getEnv();

const ERROR_ALERT = new Error(
  "Oh no! Something went wrong; probably a malformed request or a network error.\nCheck console for more details."
);

/* Helper function to format API response data into a structured object. */
const formatter = (data) =>
  data.map((val) => {
    const artists = val.artists?.map((artist) => ({ name: artist.name }));
    return {
      songTitle: val.name,
      songArtists: artists,
      albumName: val.album?.name,
      imageUrl: val.album?.images[0]?.url ?? undefined,
      duration: val.duration_ms,
      externalUrl: val.external_urls?.spotify ?? undefined,
      previewUrl: val.preview_url ?? undefined,
    };
  });

/* Helper function to fetch data from a given URL with the access token. */
const fetcher = async (url, token) => {
  try {
    return await axios(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

/* Fetches user's top tracks from the Spotify API using TOP_TRACKS_API. */
export const getMyTopTracks = async (token) => {
  try {
    let res = await fetcher(TOP_TRACKS_API, token);
    return formatter(res.data?.items);
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return null;
  }
};

/* Fetches tracks from a given album using ALBUM_TRACK_API_GETTER. */
export const getAlbumTracks = async (albumId, token) => {
  try {
    const res = await fetcher(ALBUM_TRACK_API_GETTER(albumId), token);
    const transformedResponse = res.data?.tracks?.items?.map((item) => {
      item.album = { images: res.data?.images, name: res.data?.name };
      return item;
    });
    return formatter(transformedResponse);
  } catch (e) {
    console.error(e);
    alert(ERROR_ALERT);
    return null;
  }
};

export const searchAlbums = async (query, token) => {
  const res = await fetcher(SEARCH_API_GETTER(query), token);
  return res.data?.albums?.items.map((album) => ({
    albumId: album.id,
    albumName: album.name,
    albumCoverUrl: album.images[0]?.url,
    artistName: album.artists.map((artist) => artist.name).join(", "),
  }));
};
