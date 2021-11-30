import {chunk, range} from "../../../utils/helpers";
import {addDays, differenceInCalendarDays, format} from "date-fns";
import {pusher} from "../pusher";

let currentProgress = 0;

async function getSongsFromDay(pusherID, radioID, currentDate, startHour, endHour) {
    const PLAYLIST_URL = "https://ods.lynx.re/playlist.php";
    // The API allows you to download a maximum range of 10 hours,
    // so you need to split user range into chunks
    const hoursRange = range(startHour, endHour);
    const hoursChunk = chunk(hoursRange, 10).map(array => {
        return [array[0], array[array.length - 1]]
    });

    const songs = new Set();
    for await (let hours of hoursChunk) {
        // Modify hours so request is properly handled by API
        if (hours[1] === 24) {
            hours[1] = 0;
        }
        const fetchURL = `${PLAYLIST_URL}?r=${radioID}&date=${currentDate}&time_from=${hours[0]}&time_to=${hours[1]}`;
        const response = await fetch(fetchURL).then(response => response.json());
        response.summary.forEach(song => songs.add(song.title))
    }
    currentProgress += 1;
    await pusher.trigger(pusherID, "radioProgress", {
        status: currentProgress
    });
    return Array.from(songs);
}

async function getRadiostationTracks(pusherID, radioID, startDate, endDate, startHour, endHour) {
    currentProgress = 0;
    const startDateObj = new Date(parseInt(startDate));
    const endDateObj = new Date(parseInt(endDate));
    const totalDays = Math.abs(differenceInCalendarDays(startDateObj, endDateObj))

    const promises = [];
    for (let i = 1; i <= totalDays; i++) {
        const currentDate = format(addDays(startDateObj, i), 'dd-MM-yyyy')
        promises.push(getSongsFromDay(pusherID, radioID, currentDate, startHour, endHour));
    }

    // When all requests are completed, add songs to Set
    const results = await Promise.allSettled(promises)

    const songs = [];
    results.forEach(data => {
        if (data.status === 'fulfilled') {
            songs.push(...data.value);
        }
    })

    // Create unique array with all fetched songs
    const uniqueSongs = Array.from(new Set(songs));
    return uniqueSongs.map(song => {
        return {title: song, excluded: false}
    })
}


export default async function handler(req, res) {
    const pusherID = req.query.pusherID;
    const radioID = req.query.radioID;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const startHour = parseInt(req.query.startHour);
    const endHour = parseInt(req.query.endHour);
    const playlist = await getRadiostationTracks(pusherID, radioID, startDate, endDate, startHour, endHour);
    res.status(200).json({data: playlist})
}
