import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_APP_KEY as string,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.PUSHER_APP_CLUSTER!,
    useTLS: true,
})

export const pusherClient = new PusherClient(process.env.PUSHER_APP_KEY!, {
    cluster: process.env.PUSHER_APP_CLUSTER!,
})