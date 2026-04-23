'use client';

import { useState } from 'react';
import { useStaff } from '../lib/context/StaffContext';
import { useBookings } from '../lib/context/BookingContext';
import { useRooms } from '../lib/context/RoomContext';
import { useAuth } from '../lib/context/AuthContext';
import { USER_ROLE } from '../lib/models/User';

export default function ManagerDashboard() {
  const { staff, addStaff, updateStaff, deleteStaff, getStaffByRole } = useStaff();
  const { bookings } = useBookings();
  const { rooms } = useRooms();
  const { hasRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: USER_ROLE.RECEPTIONIST
  });

  const receptionists = getStaffByRole(USER_ROLE.RECEPTIONIST);
  const housekeepers = getStaffByRole(USER_ROLE.HOUSEKEEPER);

  const handleSubmit = (e) => {
    e.preventDefault();
    addStaff(formData);
    setFormData({ name: '', email: '', phone: '', role: USER_ROLE.RECEPTIONIST });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      deleteStaff(id);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLE.MANAGER: return 'bg-purple-100 text-purple-800';
      case USER_ROLE.RECEPTIONIST: return 'bg-blue-100 text-blue-800';
      case USER_ROLE.HOUSEKEEPER: return 'bg-green-100 text-green-800';
      case USER_ROLE.GUEST: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = [
    { label: 'Total Staff', value: staff.length, color: 'bg-blue-500' },
    { label: 'Receptionists', value: receptionists.length, color: 'bg-purple-500' },
    { label: 'Housekeepers', value: housekeepers.length, color: 'bg-green-500' },
    { label: 'Total Bookings', value: bookings.length, color: 'bg-yellow-500' },
  ];

  if (!hasRole('manager')) {
    return <div className="p-8 text-center text-gray-600">Access denied</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manager Dashboard</h1>

      {selectedTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-white text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Staff by Role</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Managers</span>
                  <span className="font-semibold">{getStaffByRole(USER_ROLE.MANAGER).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Receptionists</span>
                  <span className="font-semibold">{receptionists.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Housekeepers</span>
                  <span className="font-semibold">{housekeepers.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Room Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available</span>
                  <span className="font-semibold text-green-600">{rooms.filter(r => r.status === 'available').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Occupied</span>
                  <span className="font-semibold text-red-600">{rooms.filter(r => r.status === 'occupied').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cleaning</span>
                  <span className="font-semibold text-blue-600">{rooms.filter(r => r.status === 'cleaning').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Maintenance</span>
                  <span className="font-semibold text-yellow-600">{rooms.filter(r => r.status === 'maintenance').length}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 font-medium ${selectedTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedTab('staff')}
            className={`px-4 py-2 font-medium ${selectedTab === 'staff' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Staff Management
          </button>
        </div>
      </div>

      {selectedTab === 'staff' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showAddForm ? 'Cancel' : 'Add Staff'}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Add New Staff</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={USER_ROLE.RECEPTIONIST}>Receptionist</option>
                    <option value={USER_ROLE.HOUSEKEEPER}>Housekeeper</option>
                    <option value={USER_ROLE.MANAGER}>Manager</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    Add Staff Member
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staff.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {member.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role)}`}>
                        {member.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {member.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
