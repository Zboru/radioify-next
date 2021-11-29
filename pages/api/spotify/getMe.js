import {spotifyApi} from "../../../utils/spotify";

async function getMe(access_token) {
    spotifyApi.setAccessToken(access_token);
    return await spotifyApi.getMe();
}
export default async function handler(req, res) {
    const profile = await getMe(req.query.token);
    res.status(200).json({ profile: profile.body })
}