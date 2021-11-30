import {spotifyApi} from "../../../utils/spotify";
import {chunk} from "../../../utils/helpers";

async function addToPlaylist(playlist, songs) {
    // Delete all duplicates from playlist
    const removeTracksURIs = chunk(songs.map((track) => {
        return track.uri
    }), 100)
    const removePromises = [];
    for (let index in removeTracksURIs) {
        removePromises.push(spotifyApi.removeTracksFromPlaylist(playlist.id, removeTracksURIs[index], playlist.snapshot_id))
    }
    await Promise.allSettled(removePromises)

    // Add new tracks to playlist
    const newTracksURIs = chunk(songs.map((track) => {
        return track.uri
    }), 100)
    const newTrackPromises = [];
    for (let index in newTracksURIs) {
        newTrackPromises.push(spotifyApi.addTracksToPlaylist(playlist.id, newTracksURIs[index]));
    }
    return await Promise.allSettled(newTrackPromises)
}

export default async function handler(req, res) {
    const reqBody = JSON.parse(req.body);

    spotifyApi.setAccessToken(reqBody.token);
    const playlist = reqBody.playlist;
    const songs = reqBody.songs;
    const snapshots = await addToPlaylist(playlist, songs);
    res.status(200).json({
            data: snapshots
        }
    )
}
