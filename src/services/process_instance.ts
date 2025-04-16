import { ProcessInstance } from '../types/process';

export async function fetchProcessInstances(): Promise<ProcessInstance[]> {
  const res = await fetch('/api/process_instances');
  if (!res.ok) throw new Error('Failed to fetch process instances');
  return res.json();
}

export async function fetchProcessInstance(id: string): Promise<ProcessInstance> {
  const res = await fetch(`/api/process_instances/${id}`);
  if (!res.ok) throw new Error('Failed to fetch process instance');
  return res.json();
}
