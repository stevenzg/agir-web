import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProcessInstance } from '../../../services/process_instance';
import { ProcessInstance } from '../../../types/process';

const ProcessInstanceDetailPage = () => {
  const params = useParams();
  const { id } = params;
  const [instance, setInstance] = useState<ProcessInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      fetchProcessInstance(id)
        .then(setInstance)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div>
      <h1>Process Instance Detail</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && instance && (
        <div>
          <p><b>ID:</b> {instance.id}</p>
          <p><b>Status:</b> {instance.status}</p>
          <p><b>Created At:</b> {instance.created_at}</p>
          <p><b>Updated At:</b> {instance.updated_at}</p>
        </div>
      )}
    </div>
  );
};

export default ProcessInstanceDetailPage;
