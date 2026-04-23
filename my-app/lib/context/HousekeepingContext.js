'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Housekeeping, CLEANING_STATUS } from '../models/Housekeeping';

const HousekeepingContext = createContext(null);

export function HousekeepingProvider({ children }) {
  const [housekeepingTasks, setHousekeepingTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('hotelHousekeeping');
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      setHousekeepingTasks(parsedTasks.map(t => {
        const task = Object.assign(new Housekeeping(), t);
        task.assignedAt = new Date(t.assignedAt);
        if (t.completedAt) task.completedAt = new Date(t.completedAt);
        return task;
      }));
    } else {
      setHousekeepingTasks([]);
    }
  }, []);

  const saveTasks = (newTasks) => {
    setHousekeepingTasks(newTasks);
    localStorage.setItem('hotelHousekeeping', JSON.stringify(newTasks));
  };

  const createTask = (roomId, housekeeperId, notes) => {
    const newTask = new Housekeeping(
      Date.now().toString(),
      roomId,
      housekeeperId,
      new Date(),
      notes
    );
    const newTasks = [...housekeepingTasks, newTask];
    saveTasks(newTasks);
    return newTask;
  };

  const updateTaskStatus = (id, status) => {
    const newTasks = housekeepingTasks.map(task => 
      task.id === id ? { ...task, status, completedAt: status === CLEANING_STATUS.COMPLETED ? new Date() : null } : task
    );
    saveTasks(newTasks);
  };

  const getTasksByHousekeeper = (housekeeperId) => {
    return housekeepingTasks.filter(task => task.housekeeperId === housekeeperId);
  };

  const getTasksByRoom = (roomId) => {
    return housekeepingTasks.filter(task => task.roomId === roomId);
  };

  const getPendingTasks = () => {
    return housekeepingTasks.filter(task => task.status === CLEANING_STATUS.PENDING);
  };

  return (
    <HousekeepingContext.Provider value={{
      housekeepingTasks,
      createTask,
      updateTaskStatus,
      getTasksByHousekeeper,
      getTasksByRoom,
      getPendingTasks
    }}>
      {children}
    </HousekeepingContext.Provider>
  );
}

export function useHousekeeping() {
  const context = useContext(HousekeepingContext);
  if (!context) {
    throw new Error('useHousekeeping must be used within HousekeepingProvider');
  }
  return context;
}
