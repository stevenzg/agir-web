import { UserRole } from '../types/process';

export async function fetchUserRoles(): Promise<UserRole[]> {
  const res = await fetch('/api/user_roles');
  if (!res.ok) throw new Error('Failed to fetch user roles');
  return res.json();
}
