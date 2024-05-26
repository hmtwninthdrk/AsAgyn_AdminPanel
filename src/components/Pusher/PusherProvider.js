import React, { createContext, useContext, useEffect, useState } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext();

export const PusherProvider = ({ children }) => {
  const [pusher, setPusher] = useState(null);

  useEffect(() => {
    const pusherInstance = new Pusher('1b1aac5f3ed531c5e179', {
      cluster: 'ap2',
    });
    console.log("pusher connected");
    setPusher(pusherInstance);

    return () => {
      pusherInstance.disconnect();
    };
  }, []);

  return (
    <PusherContext.Provider value={pusher}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => useContext(PusherContext);
