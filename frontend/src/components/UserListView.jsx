import React, { useState, useEffect } from 'react';

export default function UserListView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all users from Laravel API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
        setError("");
      } else {
        setError(data.message || "Failed to fetch users.");
      }
    } catch (err) {
      setError("Network error fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch (err) {
      alert("Network error deleting user.");
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ marginBottom: '20px', color: '#1a1a1a' }}>User List</h2>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Name</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Role</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Department</th>
              <th style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{user.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{user.role}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{user.department || '-'}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}