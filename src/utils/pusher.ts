import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_APPID ?? "",
  key: process.env.PUSHER_APP_KEY ?? "",
  secret: process.env.PUSHER_APP_SECRET ?? "",
  cluster: "ap1",
  useTLS: true
});


export default pusher