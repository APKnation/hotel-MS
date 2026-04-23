'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Room, ROOM_TYPES, ROOM_STATUS } from '../models/Room';
import { mockRooms } from '../data/mockData';

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const storedRooms = localStorage.getItem('hotelRooms');
    if (storedRooms) {
      const parsedRooms = JSON.parse(storedRooms);
      setRooms(parsedRooms.map(r => Object.assign(new Room(), r)));
    } else {
      setRooms(mockRooms);
      localStorage.setItem('hotelRooms', JSON.stringify(mockRooms));
    }
  }, []);

  const saveRooms = (newRooms) => {
    setRooms(newRooms);
    localStorage.setItem('hotelRooms', JSON.stringify(newRooms));
  };

  const addRoom = (roomData) => {
    const newRoom = new Room(
      Date.now().toString(),
      roomData.number,
      roomData.type,
      roomData.pricePerNight,
      roomData.capacity,
      roomData.amenities
    );
    const newRooms = [...rooms, newRoom];
    saveRooms(newRooms);
    return newRoom;
  };

  const updateRoom = (id, roomData) => {
    const newRooms = rooms.map(room => 
      room.id === id ? { ...room, ...roomData } : room
    );
    saveRooms(newRooms);
  };

  const deleteRoom = (id) => {
    const newRooms = rooms.filter(room => room.id !== id);
    saveRooms(newRooms);
  };

  const updateRoomStatus = (id, status) => {
    const newRooms = rooms.map(room => 
      room.id === id ? { ...room, status } : room
    );
    saveRooms(newRooms);
  };

  const getAvailableRooms = () => {
    return rooms.filter(room => room.status === ROOM_STATUS.AVAILABLE);
  };

  const getRoomsByType = (type) => {
    return rooms.filter(room => room.type === type);
  };

  return (
    <RoomContext.Provider value={{
      rooms,
      addRoom,
      updateRoom,
      deleteRoom,
      updateRoomStatus,
      getAvailableRooms,
      getRoomsByType
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRooms must be used within RoomProvider');
  }
  return context;
}
