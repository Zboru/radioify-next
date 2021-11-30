import Btn from "../general/Btn";
import Card from "../general/Card";
import {useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import {LoadingIcon} from "../icons/LoadingIcon";
import {CheckmarkIcon} from "../icons/CheckmarkIcon";
import {channel, channelID} from "../../utils/pusher";

export default function Step3({active, onForward, onBackward, timeRange, songs, radio, setSongs}) {
    const [searching, setSearching] = useState(false);
    const [radioProgress, setRadioProgress] = useState(0);
    function getTotalDays() {
        return Math.abs(differenceInCalendarDays(timeRange.endDate, timeRange.startDate))
    }

    function getTotalHours() {
        const hours = timeRange.endHour - timeRange.startHour;
        return hours * getTotalDays();
    }

    function startSearch() {
        setRadioProgress(0);
        setSearching(true);
        const radioID = radio?.value ?? 1;
        fetch(`/api/odslynx/getTracks?pusherID=${channelID}&radioID=${radioID}&startDate=${new Date(timeRange.startDate).getTime()}&endDate=${new Date(timeRange.endDate).getTime()}&startHour=${timeRange.startHour}&endHour=${timeRange.endHour}`)
            .then(response => response.json())
            .then(response => {
                setSongs(response.data);
                setSearching(false);
            })
    }

    useEffect(()=>{
        channel.bind("radioProgress", function (data) {
            setRadioProgress(data.status)
        });
    }, [])

    return (
        <Card active={active}>
            <p>Aplikacja wyszuka teraz wszystkie piosenki, które były grane w danym okresie. Wybrano
                łącznie <span className="font-medium">{getTotalDays()} dni</span>, czyli dokładnie <span
                    className="font-medium">{getTotalHours()} godzin</span> licząc z ustalonego przedziału.
            </p>
            <p className="mt-2">Czy chcesz kontynuować?</p>
            {searching &&
            <p className="text-gray-500 italic flex items-center">
                <LoadingIcon className="animate-spin"/>
                <span className="ml-2">Szukam... {radioProgress} / {getTotalDays()} dni</span>
            </p>
            }
            {!searching && songs && !!songs.length &&
            <p className="text-gray-500 italic flex items-center">
                <CheckmarkIcon/>
                <span className="ml-1">Znalazłem ponad {songs.length} piosenek!</span>
            </p>
            }
            <div className="flex mt-2">
                <Btn onClick={startSearch}>Szukaj</Btn>
                <div className="flex-grow"/>
                <Btn className="mr-2" onClick={onBackward}>Wstecz</Btn>
                <Btn disabled={songs && !songs.length} onClick={onForward}>Dalej</Btn>
            </div>
        </Card>
    )
}
