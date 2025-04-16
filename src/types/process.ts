export interface Process {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  nodes?: ProcessNode[];
  transitions?: ProcessTransition[];
}

export interface ProcessNode {
  id: string;
  process_id: string;
  name: string;
  description?: string;
  node_type?: string;
  created_at: string;
  updated_at: string;
  role?: UserRole;
  outgoing_transitions?: ProcessTransition[];
  incoming_transitions?: ProcessTransition[];
}

export interface ProcessTransition {
  id: string;
  process_id: string;
  from_node_id: string;
  to_node_id: string;
  condition?: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessInstance {
  id: string;
  process_id: string;
  current_node_id?: string;
  initiator_id: string;
  status: 'RUNNING' | 'COMPLETED' | 'TERMINATED';
  created_at: string;
  updated_at: string;
  process?: Process;
  current_node?: ProcessNode;
  initiator?: User;
}

export interface ProcessInstanceStep {
  id: string;
  instance_id: string;
  node_id: string;
  user_id: string;
  action: string;
  comment?: string;
  created_at: string;
  instance?: ProcessInstance;
  node?: ProcessNode;
  user?: User;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  nodes?: ProcessNode[];
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}
