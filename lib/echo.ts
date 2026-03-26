import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { cookieService } from "./cookie";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

const isServer = typeof window === "undefined";

export const getEcho = () => {
  if (isServer) return null;

  if (!window.Echo) {
    const authToken = cookieService.getCookie("authToken");

    window.Pusher = Pusher;

    window.Echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,

      // ✅ FIXED
      wsHost: "websocket.aerophantom.com",
      wssHost: "websocket.aerophantom.com",

      wsPort: 80,
      wssPort: 443,

      forceTLS: true,
      enabledTransports: ["ws", "wss"],

      disableStats: true,

      authEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcasting/auth`,

      auth: {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
          Accept: "application/json",
        },
      },
    });
  }

  return window.Echo;
};

export default getEcho;
