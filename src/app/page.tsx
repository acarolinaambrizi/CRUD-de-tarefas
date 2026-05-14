"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus } from '@/types/task';
import { TaskItem } from '@/components/task-item';
import { TaskForm } from '@/components/task-form';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Loader2, ListTodo, Sparkles, Trash2 } from 'lucide-react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

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
      console.error("Erro ao carregar:", error);
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
      toast.error("Erro ao adicionar tarefa.");
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
      
      if (newStatus === 'completed') {
        toast.success("Tarefa concluída! 🎉");
      }
    } catch (error: any) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const updateTaskTitle = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;
      
      setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle } : t));
      toast.success("Título atualizado.");
    } catch (error: any) {
      toast.error("Erro ao atualizar título.");
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
      toast.success("Tarefa removida.");
    } catch (error: any) {
      toast.error("Erro ao remover tarefa.");
    }
  };

  const clearCompleted = async () => {
    const completedIds = tasks.filter(t => t.status === 'completed').map(t => t.id);
    if (completedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedIds);

      if (error) throw error;
      setTasks(tasks.filter(t => t.status !== 'completed'));
      toast.success(`${completedIds.length} tarefas removidas.`);
    } catch (error: any) {
      toast.error("Erro ao limpar tarefas.");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-6 sm:p-8 max-w-md mx-auto font-sans">
      <header className="w-full mb-8 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Minhas Tarefas</h1>
              <p className="text-xs text-slate-500 font-medium">Organize seu dia com facilidade</p>
            </div>
          </div>
        </div>
        
        {tasks.length > 0 && (
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Seu Progresso</span>
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <motion.div 
                className="bg-indigo-600 h-full"
                initial={{ width: 0 }}
                animate={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
                transition={{ duration: 0.8, ease: "circOut" }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1 rounded-2xl">
              <TabsTrigger value="all" className="rounded-xl text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Todas</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Pendentes</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm">Feitas</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {completedCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCompleted}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-500 self-end h-auto py-1 px-2"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Limpar concluídas
            </Button>
          )}
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col gap-8">
        <section>
          <TaskForm onAdd={addTask} />
        </section>

        <section className="flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600/40" />
              <p className="text-sm text-slate-400 animate-pulse">Sincronizando...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-200"
            >
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-semibold mb-1">Nada por aqui!</h3>
              <p className="text-sm text-slate-500">
                {filter === "all" ? "Adicione uma tarefa para começar." : "Nenhuma tarefa encontrada neste filtro."}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    layout
                  >
                    <TaskItem 
                      task={task} 
                      onToggle={toggleTask} 
                      onDelete={deleteTask}
                      onUpdateTitle={updateTaskTitle}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto pt-12 w-full">
        <MadeWithDyad />
      </footer>
      <Toaster position="bottom-center" expand={false} richColors />
    </div>
  );
}