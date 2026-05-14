export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  category: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
}