'use client';

import React, { useEffect, useState } from 'react';
import { fetchProcesses } from '../../services/process';
import { Process } from '../../types/process';

const ProcessListPage = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProcesses()
      .then(setProcesses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Process Management</h1>
      {/* List, create button, search, etc. */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{process.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{process.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProcessListPage;
