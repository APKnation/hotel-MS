'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { RoomKey } from '../models/RoomKey';

const RoomKeyContext = createContext(null);

export function RoomKeyProvider({ children }) {
  const [roomKeys, setRoomKeys] = useState([]);

  useEffect(() => {
    const storedKeys = localStorage.getItem('hotelRoomKeys');
    if (storedKeys) {
      const parsedKeys = JSON.parse(storedKeys);
      setRoomKeys(parsedKeys.map(k => Object.assign(new RoomKey(), k)));
    } else {
      setRoomKeys([]);
    }
  }, []);

  const saveKeys = (newKeys) => {
    setRoomKeys(newKeys);
    localStorage.setItem('hotelRoomKeys', JSON.stringify(newKeys));
  };

  const assignKey = (roomId, bookingId) => {
    const newKey = new RoomKey(Date.now().toString(), roomId, bookingId);
    const newKeys = [...roomKeys, newKey];
    saveKeys(newKeys);
    return newKey;
  };

  const returnKey = (keyId) => {
    const newKeys = roomKeys.map(key => 
      key.id === keyId ? { ...key, returnedAt: new Date(), isActive: false } : key
    );
    saveKeys(newKeys);
  };

  const getActiveKey = (bookingId) => {
    return roomKeys.find(key => key.bookingId === bookingId && key.isActive);
  };

  return (
    <RoomKeyContext.Provider value={{
      roomKeys,
      assignKey,
      returnKey,
      getActiveKey
    }}>
      {children}
    </RoomKeyContext.Provider>
  );
}

export function useRoomKeys() {
  const context = useContext(RoomKeyContext);
  if (!context) {
    throw new Error('useRoomKeys must be used within RoomKeyProvider');
  }
  return context;
}
