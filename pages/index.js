import clsx from "clsx";
import Link from "next/link";
import Image from "next/image"
import {useEffect, useState} from "react";
import {useSessionStorage} from "../hooks/useSessionStorage";
import SpotifyIcon from "../components/icons/SpotifyIcon";
import {useRouter} from "next/router";
import {SaxophoneIcon} from "../components/icons/SaxophoneIcon";

export default function Home({children}) {
    const router = useRouter();
    const [dataLoading, setLoading] = useState(false);
    const [spotifyProfile, setProfile] = useSessionStorage('spoitfyProfile', null);
    const [spotifyToken, setToken] = useSessionStorage('spotifyToken', null)

    function spotifyLogin() {
        fetch('/api/spotify/authorizeURL')
            .then(response => response.json())
            .then(response => {
            window.location.href = response.url;
        })
    }

    // Save Spotify access token to session storage
    useEffect(() => {
        // Remove hash from response
        const locationString = location?.hash.replaceAll("#", "");
        const authObject = Object.fromEntries(new URLSearchParams(locationString));
        // Save access token with expiration date
        if (authObject.access_token) {
            const date = new Date()
            setToken({
                token: authObject.access_token,
                expires_in: date.setHours(date.getHours() + 1)
            });
            router.push('/')
        }
    })

    /**
     * Fetch Spotify profile data using access token
     */
    function loadProfile() {
        if (spotifyToken !== null && spotifyProfile === null) {
            setLoading(true);
            fetch(`/api/spotify/getMe?token=${spotifyToken.token}`).then(response => response.json()).then(response => {
                setProfile(response.profile);
                setTimeout(() => {
                    setLoading(false)
                }, 500);
            })
        }
    }

    useEffect(() => {
        loadProfile();
    }, [spotifyToken])

    function spotifyProfileExists() {
        return spotifyProfile !== null
    }

    /**
     * Return profile image from Spotify if user has Facebook connection
     * or return common user icon placeholder
     * @returns {string|*}
     */
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
                <Image className={"w-10 h-10 rounded-full mr-2"} width="32px" height="32px" src={spotifyProfileImage()} alt=""/>
                <p className="ml-2">Zalogowany jako {spotifyProfile?.display_name}</p>
            </div>
            }
            {spotifyProfileExists() &&
            <p className="inline-block">
                <Link href='/app'>
                    <button className="rounded-lg mt-4 border border-gray-200 bg-white text-sm font-medium flex items-center px-4 py-2 text-gray-900 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-2 focus:ring-green-600 focus:text-green-700 mr-3 mb-3">
                        <SaxophoneIcon className="text-xl" />
                        <span className="ml-4">Przejdź do aplikacji</span>
                    </button>
                </Link>
            </p>
            }
        </div>
    )
}
