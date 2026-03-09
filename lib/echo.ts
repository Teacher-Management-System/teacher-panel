import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Add this to handle TypeScript window augmentation
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

const isServer = typeof window === "undefined";

const echoConfig = {
  broadcaster: "pusher" as const,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "local", // Matches your Laravel .env PUSHER_APP_KEY
  wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || "127.0.0.1",
  wsPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT || "6001"),
  forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
  disableStats: true,
  enabledTransports: ["ws", "wss"] as any,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "mt1",
};

export const getEcho = () => {
  if (isServer) return null;

  if (!window.Echo) {
    window.Pusher = Pusher;
    window.Echo = new Echo(echoConfig);
  }

  return window.Echo;
};

export default getEcho;
