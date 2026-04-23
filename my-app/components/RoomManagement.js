'use client';

import { useState } from 'react';
import { useRooms } from '../lib/context/RoomContext';
import { useAuth } from '../lib/context/AuthContext';
import { ROOM_TYPES, ROOM_STATUS } from '../lib/models/Room';

export default function RoomManagement() {
  const { rooms, addRoom, updateRoom, deleteRoom, updateRoomStatus } = useRooms();
  const { hasRole } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    type: ROOM_TYPES.STANDARD,
    pricePerNight: '',
    capacity: '',
    amenities: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const amenities = formData.amenities.split(',').map(a => a.trim()).filter(a => a);
    
    if (editingRoom) {
      updateRoom(editingRoom.id, { ...formData, amenities, pricePerNight: Number(formData.pricePerNight), capacity: Number(formData.capacity) });
      setEditingRoom(null);
    } else {
      addRoom({ ...formData, amenities, pricePerNight: Number(formData.pricePerNight), capacity: Number(formData.capacity) });
    }
    
    setFormData({ number: '', type: ROOM_TYPES.STANDARD, pricePerNight: '', capacity: '', amenities: '' });
    setShowAddForm(false);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      amenities: room.amenities.join(', ')
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteRoom(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ROOM_STATUS.AVAILABLE: return 'bg-green-100 text-green-800';
      case ROOM_STATUS.OCCUPIED: return 'bg-red-100 text-red-800';
      case ROOM_STATUS.MAINTENANCE: return 'bg-yellow-100 text-yellow-800';
      case ROOM_STATUS.CLEANING: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case ROOM_TYPES.STANDARD: return 'bg-gray-100 text-gray-800';
      case ROOM_TYPES.DELUXE: return 'bg-purple-100 text-purple-800';
      case ROOM_TYPES.FAMILY: return 'bg-blue-100 text-blue-800';
      case ROOM_TYPES.BUSINESS_SUITE: return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasRole('receptionist') && !hasRole('manager')) {
    return <div className="p-8 text-center text-gray-600">Access denied</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Room Management</h1>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingRoom(null); setFormData({ number: '', type: ROOM_TYPES.STANDARD, pricePerNight: '', capacity: '', amenities: '' }); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : 'Add Room'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
              <input
                type="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={ROOM_TYPES.STANDARD}>Standard</option>
                <option value={ROOM_TYPES.DELUXE}>Deluxe</option>
                <option value={ROOM_TYPES.FAMILY}>Family</option>
                <option value={ROOM_TYPES.BUSINESS_SUITE}>Business Suite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night (TZS)</label>
              <input
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                placeholder="WiFi, TV, AC, Mini Bar"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {editingRoom ? 'Update Room' : 'Add Room'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Room {room.number}</div>
                  <div className="text-sm text-gray-500">Floor {room.floor}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(room.type)}`}>
                    {room.type.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  TZS {room.pricePerNight.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {room.capacity} guests
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={room.status}
                    onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                    className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(room.status)}`}
                  >
                    <option value={ROOM_STATUS.AVAILABLE}>Available</option>
                    <option value={ROOM_STATUS.OCCUPIED}>Occupied</option>
                    <option value={ROOM_STATUS.MAINTENANCE}>Maintenance</option>
                    <option value={ROOM_STATUS.CLEANING}>Cleaning</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(room)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
