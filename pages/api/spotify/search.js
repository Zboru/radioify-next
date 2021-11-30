import {pusher} from "../pusher";

const {spotifyApi} = require("../../../utils/spotify");

let currentProgress = 0;

async function findSpotifyTrack(song) {
    const songDetails = song.split(' - ');
    // Remove obsolete strings from artist and track name
    const artists = songDetails[0].trim().split(/[&;\/(feat.)]/)
    let title;
    if (songDetails[1]) {
        title = songDetails[1].trim().split(/(feat)|(ft)|(prod)|[(]/gi)[0].split("\'").join("");
    } else {
        title = "";
    }
    for await (let artist of artists) {
        artist = artist.split("\'").join("");
        const foundTracks = await spotifyApi.searchTracks(`track:${title} artist:${artist}`);
        if (foundTracks?.body.tracks.items.length) {
            const tracks = foundTracks.body.tracks.items;
            return tracks[0];
        }
    }
}

async function fetchTracks(access_token, pusherID, songs) {
    currentProgress = 0;
    spotifyApi.setAccessToken(access_token);
    const notFoundSongs = [];
    const tracks = [];
    for await (let song of songs) {
        const track = await findSpotifyTrack(song.title);
        if (track === undefined) {
            notFoundSongs.push(song);
        } else {
            tracks.push(track);
        }
        currentProgress += 1;
        await pusher.trigger(pusherID, "spotifyProgress", {
            status: currentProgress
        });
    }
    return {tracks, notFoundSongs};
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' })
        return;
    }
    const reqBody = JSON.parse(req.body);
    const token = reqBody.token;
    const pusherID = reqBody.pusherID
    const radioSongs = reqBody.songs;
    const tracks = await fetchTracks(token, pusherID, radioSongs);
    res.status(200).json({ data: tracks })
}
