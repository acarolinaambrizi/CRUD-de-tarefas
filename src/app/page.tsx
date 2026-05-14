"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Task, TaskStatus } from '@/types/task';
import { TaskItem } from '@/components/task-item';
import { TaskForm } from '@/components/task-form';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Loader2, ListTodo } from 'lucide-react';
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar tarefas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (title: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, status: 'pending' }])
        .select();

      if (error) throw error;
      if (data) {
        setTasks([data[0], ...tasks]);
        toast.success("Tarefa adicionada!");
      }
    } catch (error: any) {
      toast.error("Erro ao adicionar: " + error.message);
    }
  };

  const toggleTask = async (id: string, currentStatus: string) => {
    const newStatus: TaskStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, completed_at: completedAt })
        .eq('id', id);

      if (error) throw error;
      
      setTasks(tasks.map(t => 
        t.id === id ? { ...t, status: newStatus, completed_at: completedAt } : t
      ));
    } catch (error: any) {
      toast.error("Erro ao atualizar: " + error.message);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
      toast.success("Tarefa removida");
    } catch (error: any) {
      toast.error("Erro ao remover: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-8 max-w-md mx-auto">
      <header className="w-full mb-8 mt-4 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
          <ListTodo className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Minhas Tarefas</h1>
      </header>

      <main className="w-full flex-1 flex flex-col gap-6">
        <TaskForm onAdd={addTask} />

        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">Nenhuma tarefa por aqui.</p>
              <p className="text-xs">Comece adicionando uma acima!</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask} 
              />
            ))
          )}
        </div>
      </main>

      <footer className="mt-auto pt-8 w-full">
        <MadeWithDyad />
      </footer>
      <Toaster position="top-center" />
    </div>
  );
}