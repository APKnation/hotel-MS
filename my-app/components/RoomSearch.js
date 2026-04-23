'use client';

import { useState } from 'react';
import { useRooms } from '../lib/context/RoomContext';
import { ROOM_TYPES } from '../lib/models/Room';

export default function RoomSearch({ onBook }) {
  const { rooms, getAvailableRooms } = useRooms();
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    capacity: ''
  });

  const filteredRooms = rooms.filter(room => {
    if (!room.isAvailable()) return false;
    if (filters.type && room.type !== filters.type) return false;
    if (filters.minPrice && room.pricePerNight < Number(filters.minPrice)) return false;
    if (filters.maxPrice && room.pricePerNight > Number(filters.maxPrice)) return false;
    if (filters.capacity && room.capacity < Number(filters.capacity)) return false;
    return true;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case ROOM_TYPES.STANDARD: return 'bg-gray-100 text-gray-800';
      case ROOM_TYPES.DELUXE: return 'bg-purple-100 text-purple-800';
      case ROOM_TYPES.FAMILY: return 'bg-blue-100 text-blue-800';
      case ROOM_TYPES.BUSINESS_SUITE: return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Search Rooms</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              <option value={ROOM_TYPES.STANDARD}>Standard</option>
              <option value={ROOM_TYPES.DELUXE}>Deluxe</option>
              <option value={ROOM_TYPES.FAMILY}>Family</option>
              <option value={ROOM_TYPES.BUSINESS_SUITE}>Business Suite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (TZS)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              placeholder="Min price"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (TZS)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="Max price"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Capacity</label>
            <input
              type="number"
              value={filters.capacity}
              onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
              placeholder="Guests"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">{room.number}</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(room.type)}`}>
                  {room.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-green-600 font-semibold">Available</span>
              </div>
              <p className="text-gray-600 mb-2">Capacity: {room.capacity} guests</p>
              <p className="text-gray-600 mb-4">Floor: {room.floor}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.map((amenity, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    TZS {room.pricePerNight.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">per night</p>
                </div>
                <button
                  onClick={() => onBook(room)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No rooms match your criteria</p>
        </div>
      )}
    </div>
  );
}
