"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { TaskItem } from '@/components/task-item';
import { TaskForm } from '@/components/task-form';
import { TaskStats } from '@/components/task-stats';
import { AuthScreen } from '@/components/auth-screen';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Loader2, ListTodo, Sparkles, LogOut, Search, Filter, LayoutDashboard } from 'lucide-react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "due">("created");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchTasks();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchTasks();
      else {
        setTasks([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
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

  const addTask = async (title: string, category: string, priority: TaskPriority, dueDate: Date | null, notes: string) => {
    if (!session?.user) return;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          title, 
          category, 
          priority, 
          notes,
          due_date: dueDate ? dueDate.toISOString() : null,
          status: 'pending',
          user_id: session.user.id 
        }])
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
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus, completed_at: completedAt } : t));
      if (newStatus === 'completed') toast.success("Tarefa concluída! 🎉");
    } catch (error: any) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const updateTaskTitle = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase.from('tasks').update({ title: newTitle }).eq('id', id);
      if (error) throw error;
      setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle } : t));
      toast.success("Título atualizado.");
    } catch (error: any) {
      toast.error("Erro ao atualizar título.");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      setTasks(tasks.filter(t => t.id !== id));
      toast.success("Tarefa removida.");
    } catch (error: any) {
      toast.error("Erro ao remover tarefa.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Até logo!");
  };

  if (!session && !loading) return <AuthScreen />;

  const priorityOrder = { "Alta": 3, "Média": 2, "Baixa": 1 };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "priority") {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === "due") {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const filteredTasks = sortedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center p-6 sm:p-8 max-w-md mx-auto font-sans">
      <header className="w-full mb-8 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dyad Tasks</h1>
              <p className="text-xs text-slate-500 font-medium">Olá, {session?.user?.email?.split('@')[0]}</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-rose-600 rounded-xl">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        
        <TaskStats tasks={tasks} />

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar tarefas..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-2xl bg-white border-slate-100 shadow-sm h-10 text-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-2xl h-10 w-10 border-slate-100 bg-white shadow-sm">
                  <Filter className="w-4 h-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-xl">
                <DropdownMenuLabel className="text-xs">Ordenar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("created")} className="text-xs">Data de criação</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("priority")} className="text-xs">Prioridade</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("due")} className="text-xs">Data de entrega</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 p-1 rounded-2xl">
              <TabsTrigger value="all" className="rounded-xl text-xs font-semibold">Todas</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl text-xs font-semibold">Pendentes</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-xl text-xs font-semibold">Feitas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col gap-8">
        <section><TaskForm onAdd={addTask} /></section>

        <section className="flex flex-col gap-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600/40" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-200">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-4" />
              <p className="text-sm text-slate-500">Nenhuma tarefa encontrada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
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

      <footer className="mt-auto pt-12 w-full"><MadeWithDyad /></footer>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}