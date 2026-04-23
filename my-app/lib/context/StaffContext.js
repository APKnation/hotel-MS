'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User, USER_ROLE } from '../models/User';
import { mockUsers } from '../data/mockData';

const StaffContext = createContext(null);

export function StaffProvider({ children }) {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const storedStaff = localStorage.getItem('hotelStaff');
    if (storedStaff) {
      const parsedStaff = JSON.parse(storedStaff);
      setStaff(parsedStaff.map(s => {
        const user = Object.assign(new User(), s);
        user.createdAt = new Date(s.createdAt);
        return user;
      }));
    } else {
      setStaff(mockUsers);
      localStorage.setItem('hotelStaff', JSON.stringify(mockUsers));
    }
  }, []);

  const saveStaff = (newStaff) => {
    setStaff(newStaff);
    localStorage.setItem('hotelStaff', JSON.stringify(newStaff));
  };

  const addStaff = (staffData) => {
    const newStaff = new User(
      Date.now().toString(),
      staffData.name,
      staffData.email,
      staffData.phone,
      staffData.role
    );
    const newStaffList = [...staff, newStaff];
    saveStaff(newStaffList);
    return newStaff;
  };

  const updateStaff = (id, staffData) => {
    const newStaffList = staff.map(member => 
      member.id === id ? { ...member, ...staffData } : member
    );
    saveStaff(newStaffList);
  };

  const deleteStaff = (id) => {
    const newStaffList = staff.filter(member => member.id !== id);
    saveStaff(newStaffList);
  };

  const getStaffByRole = (role) => {
    return staff.filter(member => member.role === role);
  };

  return (
    <StaffContext.Provider value={{
      staff,
      addStaff,
      updateStaff,
      deleteStaff,
      getStaffByRole
    }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within StaffProvider');
  }
  return context;
}
