import Btn from "../general/Btn";
import Card from "../general/Card";
import {createRef, useState} from "react";
import {LoadingIcon} from "../icons/LoadingIcon";
import {CheckmarkIcon} from "../icons/CheckmarkIcon";
import Fuse from "fuse.js";
import {useSessionStorage} from "../../hooks/useSessionStorage";

export default function Step4({active, onForward, onBackward, radioSongs, setRadioSongs, spotifySongs, setSpotifySongs}) {
    const [searching, setSearching] = useState(false);
    const [songFilter, setSongFilter] = useState(null);
    const [spotifyToken, setTokens] = useSessionStorage('spotifyToken', null);
    const songListContainer = createRef();

    /**
     * Get possible duration of searching all songs in Spotify
     * @returns {string}
     */
    function searchDuration() {
        return (radioSongs?.length / 4.8).toFixed(2)
    }

    /**
     * Exclude or include a song from/to your Spotify search
     * @param event
     * @param song
     */
    function toggleSong(event, song) {
        const songs = [...radioSongs];
        const songIndex = songs.indexOf(song);
        songs[songIndex].excluded = !event.currentTarget.checked
        setRadioSongs(songs)
    }

    function handleFilterChange(event) {
        const value = event.currentTarget.value
        if (songListContainer.current) {
            songListContainer.current.scrollTop = 0;
        }
        setSongFilter(value);
    }

    const options = {
        includeScore: true,
        keys: ['title'],
    }
    const fuse = new Fuse(radioSongs, options)

    function filteredSongs(filter) {
        if (filter !== null && filter !== "") {
            return fuse.search(filter).map(result => result.item);
        } else {
            return radioSongs;
        }

    }

    function searchSongs() {
        setSearching(true)
        const notExcludedSongs = radioSongs.filter(song => !song.excluded)
        fetch('/api/spotify/search', {
            method: "POST",
            body: JSON.stringify({songs: notExcludedSongs, token: spotifyToken.token})
        })
            .then(response => response.json())
            .then(response => {
                setSpotifySongs(response.data)
                setSearching(false);
            })
    }

    return (
        <Card active={active}>
            <p>Sprawdź pobraną listę i zaznacz utwory, które mają zostać wyszukane w serwisie Spotify. Utwory odznaczone
                zostaną wykluczone z wyszukiwania oraz umieszczenia w playliście.</p>
            <div className="flex">
                <div className="flex-grow"/>
                <input type="text" className="mt-2 border p-2 rounded-md" onChange={handleFilterChange}
                       placeholder="Wyszukaj utwór"/>
            </div>
            <div ref={songListContainer}
                 className="overflow-auto border rounded no-scrollbar shadow-md dark:border-gray-700 light:border-gray-300 h-56 w-100">
                {filteredSongs(songFilter).map((song, index) => {
                    return (
                        <div key={index}
                             className="flex items-center dark:bg-gray-900 bg-white pr-2 border-b dark:border-gray-700 light:border-gray-300 select-none">
                            <input onChange={(event) => {
                                toggleSong(event, song)
                            }} checked={!song.excluded} id={`song-${index}`} type="checkbox" className="m-3"/>
                            <label className="w-full cursor-pointer py-2" htmlFor={`song-${index}`}>{song.title}</label>
                        </div>
                    )
                })}
            </div>
            <p className="mt-4">Czy chcesz kontynuować? Ta operacja może potrwać ponad {searchDuration()} sekund.</p>
            {searching &&
            <p className="text-gray-500 italic flex items-center">
                <LoadingIcon className="animate-spin"/>
                <span className="ml-2">Szukam...</span>
            </p>
            }
            {(!searching && spotifySongs?.tracks && spotifySongs.tracks.length) &&
            <p className="text-gray-500 italic flex items-center">
                <CheckmarkIcon/>
                <span className="ml-2">Znalazłem ponad {spotifySongs.tracks.length} piosenek!</span>
            </p>
            }
            <div className="flex mt-2">
                <Btn onClick={searchSongs}>Szukaj</Btn>
                <div className="flex-grow"/>
                <Btn className="mr-2" onClick={onBackward}>Wstecz</Btn>
                <Btn disabled={!spotifySongs?.tracks.length} onClick={onForward}>Dalej</Btn>
            </div>

        </Card>

    )
}
