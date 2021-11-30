import Pusher from "pusher-js";

export const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: "eu"
})
export const channelID = `${Date.now()}`;
export const channel = pusher.subscribe(channelID);
