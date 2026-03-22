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
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    window.Pusher = Pusher;

    window.Echo = new Echo({
      broadcaster: "reverb", // 🔥 FIXED
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "local-key",
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || "127.0.0.1",
      wsPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT || 8080),
      wssPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT || 8080),
      forceTLS: false,
      disableStats: true,
      enabledTransports: ["ws", "wss"],

      authEndpoint: `/broadcasting/auth`,
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
