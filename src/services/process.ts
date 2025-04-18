import { Process, ProcessNode, ProcessTransition } from '../types/process';

import { api } from './api';

// Process operations
export async function fetchProcesses(): Promise<Process[]> {
  const res = await api.get<Process[]>('/processes');
  return res.data;
}

export async function fetchProcess(id: string): Promise<Process> {
  const res = await api.get<Process>(`/processes/${id}`);
  return res.data;
}

export async function createProcess(data: { name: string; description?: string }): Promise<Process> {
  const res = await api.post<Process>('/processes', data);
  return res.data;
}

// Node operations
export async function createProcessNode(data: {
  process_id: string;
  name: string;
  description?: string;
  node_type?: string;
  role_id?: string;
}): Promise<ProcessNode> {
  const res = await api.post<ProcessNode>('/processes/nodes', data);
  return res.data;
}

export async function fetchProcessNode(id: string): Promise<ProcessNode> {
  const res = await api.get<ProcessNode>(`/processes/nodes/${id}`);
  return res.data;
}

// Transition operations
export async function createProcessTransition(data: {
  process_id: string;
  from_node_id: string;
  to_node_id: string;
  condition?: string;
}): Promise<ProcessTransition> {
  const res = await api.post<ProcessTransition>('/processes/transitions', data);
  return res.data;
}

export async function fetchProcessTransition(id: string): Promise<ProcessTransition> {
  const res = await api.get<ProcessTransition>(`/processes/transitions/${id}`);
  return res.data;
}
