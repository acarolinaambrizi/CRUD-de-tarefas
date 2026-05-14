export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  status: TaskStatus;
  category: string;
  priority: TaskPriority;
  notes?: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}