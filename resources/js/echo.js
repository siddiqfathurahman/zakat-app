import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Setup Pusher/Reverb protocol
window.Pusher = Pusher;


window.Echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY || "zakat-key",
  
  cluster: "mt1",
  wsHost: window.location.hostname,
  wsPort: 8081,
  wssPort: 8081,
  forceTLS: false,
  encrypted: false,
  enabledTransports: ["ws"],
  namespace: false,
});


// Test connection availability
setTimeout(() => {
  if (window.Echo?.connector) {
  } else {
  }
}, 500);

export default window.Echo;
