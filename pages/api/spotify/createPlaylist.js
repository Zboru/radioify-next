import {spotifyApi} from "../../../utils/spotify";

export default async function handler(req, res) {
    const reqBody = JSON.parse(req.body);
    const playlistName = reqBody.name;
    spotifyApi.setAccessToken(reqBody.token);
    const playlist = await spotifyApi.createPlaylist(playlistName).then(response => {
        return response
    })
    res.status(200).json({data: playlist})
}
