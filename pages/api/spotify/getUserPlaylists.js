import {spotifyApi} from "../../../utils/spotify";

async function getPlaylists(access_token, user_id) {
    return await spotifyApi.getUserPlaylists(user_id, {'limit': 50}).then((response) => {
        return response
    })
}

export default async function handler(req, res) {
    spotifyApi.setAccessToken(req.query.token);
    const user = await spotifyApi.getMe();
    const playlists = await getPlaylists(user.body.id);
    res.status(200).json({
            data: {
                playlists: playlists.body.items,
                user_id: user.body.id
            }
        }
    )
}
