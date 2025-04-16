import React, { useEffect, useState } from 'react';
import { fetchProcessInstances } from '../../services/process_instance';
import { ProcessInstance } from '../../types/process';

const ProcessInstanceListPage = () => {
  const [instances, setInstances] = useState<ProcessInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProcessInstances()
      .then(setInstances)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Process Instance Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Created At</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {instances.map((instance) => (
              <tr key={instance.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{instance.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{instance.status}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{instance.created_at}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{instance.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProcessInstanceListPage;
