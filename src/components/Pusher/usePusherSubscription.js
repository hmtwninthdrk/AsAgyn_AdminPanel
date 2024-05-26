import { useEffect } from 'react';
import { usePusher } from './PusherProvider';


const usePusherEvent = (channelName, eventName, callback) => {
  const pusher = usePusher();

  useEffect(() => {
    if (pusher) {
      const channel = pusher.subscribe(channelName);
      channel.bind(eventName, callback);

      return () => {
        channel.unbind(eventName, callback);
      };
    }
  }, [pusher, channelName, eventName, callback]);
};

export default usePusherEvent;
