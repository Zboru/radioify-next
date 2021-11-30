import Pusher from "pusher";

export const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

export default async function handler(req, res) {
    setTimeout(async () => {
        const response = await pusher.trigger(req.query.id, "spotifySongs", {
            status: true
        });
    }, 30000)
    res.json({message: "completed"});
}
