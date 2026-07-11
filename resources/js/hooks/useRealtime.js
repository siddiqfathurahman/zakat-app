import { useEffect } from "react";
import Echo from "../echo";

/**
 * Hook untuk subscribe ke channel dan listen ke events
 * @param {string} channelName - Nama channel yang ingin di-subscribe
 * @param {string} eventName - Nama event yang ingin di-listen (tanpa titik di depan)
 * @param {function} callback - Callback function saat event diterima
 */
export function useRealtimeChannel(channelName, eventName, callback) {
  useEffect(() => {
    if (!window.Echo || !channelName || !eventName || !callback) {
      console.warn('[Realtime] Missing Echo or params:', { Echo: !!window.Echo, channelName, eventName, hasCallback: !!callback });
      return;
    }

    try {

      const channel = window.Echo.channel(channelName);
      channel.listen(`.${eventName}`, (data) => {
        callback(data);
      });

      return () => {
        window.Echo.leaveChannel(channelName);
      };
    } catch (error) {
      console.error(`[Realtime] ✗ Error subscribing to ${channelName}:`, error.message);
    }
  }, [channelName, eventName, callback]);
}

/**
 * Hook untuk subscribe ke multiple channels dengan same event
 * @param {string[]} channelNames - Array nama channels
 * @param {string} eventName - Nama event
 * @param {function} callback - Callback function
 */
export function useMultipleRealtimeChannels(channelNames, eventName, callback) {
  useEffect(() => {
    if (!Echo || !channelNames || !eventName || !callback) {
      return;
    }

    const channels = channelNames.map((name) => {
      const channel = Echo.channel(name);
      channel.listen(`.${eventName}`, (data) => {
        callback(data);
      });
      return { name, channel };
    });

    return () => {
      channels.forEach(({ name }) => {
        Echo.leaveChannel(name);
      });
    };
  }, [channelNames.join(","), eventName, callback]);
}

export default Echo;