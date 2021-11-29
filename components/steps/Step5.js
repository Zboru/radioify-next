import Card from "../general/Card";
import Btn from "../general/Btn";
import clsx from "clsx";
import {createRef, useEffect, useState} from "react";
import {useSessionStorage} from "../../hooks/useSessionStorage";

export default function Step5({onForward, onBackward, active, spotifySongs, songList}) {
    const [spotifyToken, setTokens] = useSessionStorage('spotifyToken', null);
    const [selectedPlaylist, setSelectedPlaylist] = useState({});
    const [listState, toggleList] = useState(false);
    const [spotifyPlaylists, setPlaylists] = useState(null);
    const songListContainer = createRef();
    const [newPlaylistName, setPlaylistName] = useState("");

    function notFoundSongs() {
        return spotifySongs?.notFoundSongs || []
    }

    function notExcludedSongs() {
        return songList.filter((song) => !song.excluded).length
    }

    function syncPlaylist(event) {
        const songsURIs = spotifySongs?.tracks.map(track => {
            return {uri: track.uri}
        }) ?? [];
        fetch('/api/spotify/syncPlaylist', {
            method: "POST",
            body: JSON.stringify({playlist: selectedPlaylist, songs: spotifySongs, token: spotifyToken.token})
        })
            .then(response => response.json())
            .then(response => {
                if (onForward) {
                    onForward()
                }
            })
    }

    function addNewPlaylist() {
        fetch('/api/spotify/createPlaylist', {
            method: "POST",
            body: JSON.stringify({name: newPlaylistName, token: spotifyToken.token})
        })
            .then(response => response.json())
            .then(response => {
                if (spotifyPlaylists !== null) {
                    setPlaylists([response.data.body, ...spotifyPlaylists])
                }
            })
    }

    function handlePlaylistName(event) {
        setPlaylistName(event.currentTarget.value)
    }

    function getUserPlaylists() {
        fetch(`/api/spotify/getUserPlaylists?token=${spotifyToken.token}`)
            .then(response => response.json())
            .then(response => {
                const userPlaylists = response.data.playlists.filter(playlist => {
                    return playlist.owner.id === response.data.user_id
                })
                setPlaylists(userPlaylists);
            })
    }

    useEffect(() => {
        getUserPlaylists();
    }, [])

    return (
        <Card active={active}>
            <p className="mb-2">Znaleziono ponad {spotifySongs?.tracks?.length} piosenek na Spotify
                z {notExcludedSongs()} granych w radiu.
                Poniżej jest lista piosenek, których nie udało się wyszukać:</p>
            <div ref={songListContainer}
                 className={clsx(listState ? 'h-56 border' : 'h-0', 'overflow-auto transition-height rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 w-100')}>
                {notFoundSongs().map((track, index) => {
                    return (
                        <div key={index}
                             className="flex items-center dark:bg-gray-900 light:bg-white pl-4 pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                            <label className="w-full py-2" htmlFor={`song-${index}`}>{track.title}</label>
                        </div>
                    )
                })}
                {!notFoundSongs().length &&
                <div className="flex justify-center flex-col items-center h-full">
                    <span className="iconify text-4xl" data-icon="fluent:missing-metadata-16-regular"/>
                    <span>Lista jest pusta</span>
                </div>
                }
            </div>
            <Btn onClick={() => {
                toggleList(!listState)
            }} className="p-2 border rounded mt-2">
                {listState ? 'Schowaj listę' : 'Pokaż listę'}
            </Btn>
            <p className="mt-2">Wybierz playlistę z listy lub utwórz nową, do której aplikacja doda znalezione utwory. W
                razie dodawania do istniejącej playlisty, duplikaty utworów zostaną usunięte przed ich dodaniem.</p>
            <input onChange={handlePlaylistName} className="my-2 border rounded-md p-2 md:w-1/3"
                   placeholder={"Super playlista"}
                   label={"Nazwa playlisty"}/>
            <Btn disabled={newPlaylistName.length === 0} onClick={addNewPlaylist} className="mb-4">Utwórz</Btn>
            <div
                className={'overflow-auto h-56 transition-height rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 w-100'}>
                {spotifyPlaylists?.map((playlist, index) => {
                    return (
                        <div key={index}
                             className="flex items-center dark:hover:bg-gray-700 dark:bg-gray-900 light:bg-white pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                            <input onChange={() => {
                                setSelectedPlaylist(playlist)
                            }} name='playlists' id={`playlist-${index}`} type="radio" className="m-3"/>
                            <label className="w-full py-2 cursor-pointer"
                                   htmlFor={`playlist-${index}`}>{playlist.name}</label>
                        </div>
                    )
                })}
            </div>
            <div className="flex mt-4">
                <div className="flex-grow"/>
                <Btn className="mr-2" onClick={onBackward}>Wstecz</Btn>
                <Btn onClick={syncPlaylist}>Dodaj!
                </Btn>
            </div>
        </Card>
    )
}
