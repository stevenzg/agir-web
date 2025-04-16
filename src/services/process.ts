import { Process } from '../types/process';

import { api } from './api';

export async function fetchProcesses(): Promise<Process[]> {
  const res = await api.get<Process[]>('/processes');
  return res.data;
}
