import {spotifyApi} from "../../../utils/spotify";

function createAuthorizationURL() {
    const scopes = [
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-private',
    ];
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(spotifyApi.getClientId());
    url += '&scope=' + encodeURIComponent(scopes.join(' '));
    url += '&redirect_uri=' + encodeURIComponent(spotifyApi.getRedirectURI());
    url += '&show_dialog=true';

    return url;
}

export default function handler(req, res) {
    const url = createAuthorizationURL();
    res.status(200).json({ url })
}
