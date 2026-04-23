'use client';

import { useState } from 'react';
import { useHousekeeping } from '../lib/context/HousekeepingContext';
import { useRooms } from '../lib/context/RoomContext';
import { useAuth } from '../lib/context/AuthContext';
import { CLEANING_STATUS } from '../lib/models/Housekeeping';
import { ROOM_STATUS } from '../lib/models/Room';

export default function HousekeepingManagement() {
  const { housekeepingTasks, createTask, updateTaskStatus, getPendingTasks } = useHousekeeping();
  const { rooms, updateRoomStatus } = useRooms();
  const { user, hasRole } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    notes: ''
  });

  const myTasks = hasRole('housekeeper') 
    ? housekeepingTasks.filter(t => t.housekeeperId === user?.id)
    : housekeepingTasks;
  
  const pendingTasks = getPendingTasks();

  const handleSubmit = (e) => {
    e.preventDefault();
    createTask(formData.roomId, user?.id, formData.notes);
    setFormData({ roomId: '', notes: '' });
    setShowAddForm(false);
  };

  const handleComplete = (taskId, roomId) => {
    if (confirm('Mark this task as completed?')) {
      updateTaskStatus(taskId, CLEANING_STATUS.COMPLETED);
      updateRoomStatus(roomId, ROOM_STATUS.AVAILABLE);
    }
  };

  const handleStart = (taskId) => {
    updateTaskStatus(taskId, CLEANING_STATUS.IN_PROGRESS);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case CLEANING_STATUS.PENDING: return 'bg-yellow-100 text-yellow-800';
      case CLEANING_STATUS.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
      case CLEANING_STATUS.COMPLETED: return 'bg-green-100 text-green-800';
      case CLEANING_STATUS.DIRTY: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasRole('housekeeper') && !hasRole('manager') && !hasRole('receptionist')) {
    return <div className="p-8 text-center text-gray-600">Access denied</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Housekeeping Management</h1>
        {hasRole('receptionist') && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showAddForm ? 'Cancel' : 'Assign Task'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">{pendingTasks.length}</span>
          </div>
          <p className="text-gray-600 text-sm">Pending Tasks</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">
              {housekeepingTasks.filter(t => t.status === CLEANING_STATUS.IN_PROGRESS).length}
            </span>
          </div>
          <p className="text-gray-600 text-sm">In Progress</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">
              {housekeepingTasks.filter(t => t.status === CLEANING_STATUS.COMPLETED).length}
            </span>
          </div>
          <p className="text-gray-600 text-sm">Completed Today</p>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Assign Cleaning Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select room...</option>
                {rooms.filter(r => r.status === ROOM_STATUS.CLEANING).map(room => (
                  <option key={room.id} value={room.id}>Room {room.number}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                placeholder="Special instructions..."
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Assign Task
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {myTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  Room {task.roomId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(task.assignedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {task.notes || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  {task.status === CLEANING_STATUS.PENDING && (
                    <button
                      onClick={() => handleStart(task.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Start
                    </button>
                  )}
                  {task.status === CLEANING_STATUS.IN_PROGRESS && (
                    <button
                      onClick={() => handleComplete(task.id, task.roomId)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {myTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">No housekeeping tasks found</p>
        </div>
      )}
    </div>
  );
}
