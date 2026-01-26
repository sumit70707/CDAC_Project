import React, { useEffect, useState } from 'react';
import { getAllUsers, toggleUserStatus } from '../../services/adminService';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    // In a real app, you would call the API here
    await toggleUserStatus(id, status);
    
    // For mock UI update immediately
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">👑 Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{users.length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Sellers</div>
          <div className="stat-value text-secondary">{users.filter(u => u.role === 'SELLER').length}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-box">
          <div className="stat-title">Active Orders</div>
          <div className="stat-value">124</div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="overflow-x-auto bg-base-100 shadow rounded-lg border border-gray-200">
        <table className="table">
          {/* Head */}
          <thead className="bg-base-200">
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span>{user.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-xs opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-sm ${user.role === 'ADMIN' ? 'badge-primary' : 'badge-ghost'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-sm ${user.status === 'ACTIVE' ? 'badge-success text-white' : 'badge-error text-white'}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {user.isPremium ? '⭐ Premium' : 'Standard'}
                </td>
                <th>
                  {/* Action Buttons */}
                  <button 
                    onClick={() => handleStatusChange(user.id, user.status)}
                    className="btn btn-xs btn-outline"
                  >
                    {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;