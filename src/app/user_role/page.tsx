import React, { useEffect, useState } from 'react';
import { fetchUserRoles } from '../../services/user_role';
import { UserRole } from '../../types/process';

const UserRoleListPage = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserRoles()
      .then(setRoles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>User Role Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{role.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{role.description}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{role.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserRoleListPage;
