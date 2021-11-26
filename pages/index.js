import clsx from "clsx";
import Link from "next/link";
import Image from "next/image"
import {useState} from "react";
import {useSessionStorage} from "../hooks/useSessionStorage";
import SpotifyIcon from "../components/icons/SpotifyIcon";

export default function Home({children}) {
    const [dataLoading, setLoading] = useState(false);
    const [spotifyProfile, setProfile] = useSessionStorage('spoitfyProfile', null);
    const [spotifyToken, setToken] = useSessionStorage('spotifyToken', null)

    function spotifyLogin() {
        window.location.href = '123'// createAuthorizationURL();
    }

    function spotifyProfileExists() {
        return spotifyProfile !== null
    }

    function spotifyProfileImage() {
        if (spotifyProfileExists() && spotifyProfile?.images) {
            return spotifyProfile.images[0].url;
        } else {
            return "https://api.iconify.design/ph:user.svg"
        }
    }

    return (
        <div className="p-5">
            <div className="mb-2">
                <div
                    className="md:mt-12 bg-gradient-to-bl from-green-400 via-green-300 to-blue-200 bg-clip-text text-transparent max-w-xl text-4xl md:text-6xl font-medium">
                    Przenieś swoje ulubione radio do playlisty Spotify!
                </div>
                <div className="mt-4 w-3/4 dark:text-white text-xl font-regular">
                    Radioify pozwala ci w łatwy sposób utworzyć spersonalizowaną playlistę Spotify z piosenkami z
                    Twojego radia internetowego. <br/>To wszystko w kilku prostych krokach!
                </div>
            </div>
            {dataLoading &&
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full mr-2 animate-pulse bg-gray-200"/>
                <div className="h-5 w-64 bg-gray-200 ml-2 animate-pulse rounded-lg"/>
            </div>
            }
            {(!spotifyProfileExists() && !dataLoading) &&
            <button onClick={spotifyLogin} type="button"
                    className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3">
                <SpotifyIcon className="text-xl mr-2"/>
                Zaloguj się przez Spotify
            </button>
            }
            {spotifyProfileExists() &&
            <div className={clsx('flex items-center dark:text-white', {
                'hidden': dataLoading,
                'visible': !dataLoading
            })}>
                <Image className={"w-10 h-10 rounded-full mr-2"} layout='fill' src={spotifyProfileImage()} alt=""/>
                <span>Zalogowany jako {spotifyProfile?.display_name}</span>
            </div>
            }
            {spotifyProfileExists() &&
            <p className="inline-block">
                <Link href='/app'>
                    <button className="mt-4" icon={'fxemoji:saxophone'}>Przejdź do aplikacji</button>
                </Link>
            </p>
            }
        </div>
    )
}
